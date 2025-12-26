mod options;
mod db_manager;
mod session_manager;

use options::{launcher_options::LauncherOptions, game_options::GameOptions};
use chrono::Local;
use log::{info, error, LevelFilter};
use simplelog::{WriteLogger, Config, CombinedLogger, TermLogger, TerminalMode, ColorChoice};
use std::fs::{File, create_dir_all};
use std::process::Command;
use std::sync::Arc;
use launcher_java_installer::JavaSetup;
use crate::db_manager::DbManager;
use crate::options::game_options::{GarbageCollector, BASE_VM_FLAGS};

#[derive(serde::Serialize)]
struct SessionInfo {
    user_id: i32,
    username: String,
}

/// Configure the logger to log to both console and a file in the logs directory.
fn setup_logger(options: &LauncherOptions) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(dir) = &options.launcher_dir {
        // Create logs directory if it doesn't exist
        let logs_dir = dir.join("logs");
        create_dir_all(&logs_dir)?;

        // Generate log filename based on current date
        let date_str = Local::now().format("%Y-%m-%d").to_string();
        let mut log_filename = format!("{}.log", date_str);
        let mut counter = 1;

        // Verify if the log file already exists, if so, append a counter
        while logs_dir.join(&log_filename).exists() {
            log_filename = format!("{}_{}.log", date_str, counter);
            counter += 1;
        }

        let log_path = logs_dir.join(&log_filename);

        CombinedLogger::init(vec![
            // Console log
            TermLogger::new(
                LevelFilter::Info,
                Config::default(),
                TerminalMode::Mixed,
                ColorChoice::Auto
            ),
            // File log
            WriteLogger::new(
                LevelFilter::Info,
                Config::default(),
                File::create(log_path)?
            )
        ])?;

        info!("Logger inicializado correctamente en: {}", log_filename);
        Ok(())
    } else {
        error!("No se pudo configurar el directorio de logs");
        Err("Directorio de launcher no configurado".into())
    }
}

#[tauri::command]
fn read_options() -> LauncherOptions {
    info!("Loading options");
    let options = LauncherOptions::load();
    info!("Options loaded: {:?}", options);
    options
}

#[tauri::command]
fn save_options(options: LauncherOptions) -> bool {
    info!("Saving options: {:?}", options);
    options.save();
    info!("Options saved correctly");
    true
}

#[tauri::command]
fn return_default_game_dir() -> String {
    info!("Obtaining default game directory");
    LauncherOptions::get_default_game_dir()
        .map(|path| path.to_string_lossy().into_owned())
        .unwrap_or_default().into()
}

#[tauri::command]
fn read_game_options(launcher_options: LauncherOptions) -> GameOptions {
    info!("Loading game options");
    let game_options = GameOptions::load(launcher_options);
    info!("Game options loaded: {:?}", game_options);
    game_options
}

#[tauri::command]
fn get_garbage_collectors() -> Vec<GarbageCollector> {
    info!("Retrieving garbage collectors");
    let collectors = GameOptions::get_garbage_collectors();
    info!("Garbage collectors retrieved: {:?}", collectors);
    collectors
}

#[tauri::command]
fn get_base_jvm_flags() -> Vec<String> {
    info!("Retrieving base JVM flags");
    let flags = BASE_VM_FLAGS.iter().map(|s| s.to_string()).collect();
    info!("Base JVM flags retrieved: {:?}", flags);
    flags
}

#[tauri::command]
fn save_game_options(game_options: GameOptions, launcher_options: LauncherOptions) -> bool {
    info!("Saving game options: {:?}", game_options);
    game_options.save(launcher_options);
    info!("Game options saved correctly");
    true
}

#[tauri::command]
async fn login_user(
    username: String,
    password: String,
    db: tauri::State<'_, DbManager>,
    pool: tauri::State<'_, Arc<sqlx::MySqlPool>>
) -> Result<String, String> {
    // --- Input Validation ---
    if username.is_empty() || username.len() > 16 {
        error!("Login attempt with invalid username length");
        return Err("Credenciales inválidas.".to_string());
    }

    if password.is_empty() || password.len() > 128 {
        error!("Login attempt with invalid password length");
        return Err("Credenciales inválidas.".to_string());
    }

    // Validate allowed characters in username (alphanumeric and underscore)
    if !username.chars().all(|c| c.is_alphanumeric() || c == '_') {
        error!("Login attempt with invalid characters in username");
        return Err("Credenciales inválidas.".to_string());
    }

    info!("Intentando autenticar al usuario: {}", username);

    match db.get_user_by_username(&username).await {
        Ok(Some(user)) => {
            match bcrypt::verify(password, &user.password_hash) {
                Ok(true) => {
                    // Crear sesión
                    let session_manager = session_manager::SessionManager::new(pool.inner().as_ref().clone());
                    match session_manager.create_session(user.id).await {
                        Ok(token) => {
                            info!("Login exitoso para '{}', token creado", username);
                            Ok(token)
                        }
                        Err(e) => {
                            error!("Error creando sesión para '{}': {}", username, e);
                            Err("Error al crear sesión.".to_string())
                        }
                    }
                },
                Ok(false) => {
                    info!("Incorrect password for user '{}'", username);
                    Err("Credenciales inválidas.".to_string())
                },
                Err(e) => {
                    error!("Error verifying password for '{}': {}", username, e);
                    Err("Credenciales inválidas.".to_string())
                }
            }
        },
        Ok(None) => {
            info!("Usuario '{}' no encontrado.", username);
            Err("Credenciales inválidas.".to_string())
        },
        Err(e) => {
            error!("Error de base de datos durante el login: {}", e);
            Err("Credenciales inválidas.".to_string())
        }
    }
}

#[tauri::command]
async fn register_user(
    username: String,
    password: String,
    invite_code: String,
    db: tauri::State<'_, DbManager>
) -> Result<String, String> {
    info!("Iniciando proceso de registro para el usuario: '{}'", username);

    // --- Input Validation ---
    if username.len() < 3 || username.len() > 16 {
        return Err("El nombre de usuario debe tener entre 3 y 16 caracteres.".to_string());
    }

    // Validate allowed characters in username
    if !username.chars().all(|c| c.is_alphanumeric() || c == '_') {
        return Err("El nombre de usuario solo puede contener letras, números y guiones bajos.".to_string());
    }

    if password.len() < 8 {
        return Err("La contraseña debe tener al menos 8 caracteres.".to_string());
    }

    // Validate maximum password length
    if password.len() > 128 {
        return Err("La contraseña no puede tener más de 128 caracteres.".to_string());
    }

    // Validate invitation code
    if invite_code.is_empty() || invite_code.len() > 64 {
        return Err("Código de invitación inválido.".to_string());
    }

    // --- Password Hashing ---
    // Move the hashing to another thread due to the complex CPU task it is
    let password_hash = match tokio::task::spawn_blocking(move || {
        bcrypt::hash(password, bcrypt::DEFAULT_COST)
    }).await {
        Ok(Ok(hash)) => hash,
        Ok(Err(e)) => {
            error!("Password hashing error for user '{}': {}", username, e);
            return Err("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.".to_string());
        }
        Err(e) => {
            error!("Hashing task failed for user '{}': {}", username, e);
            return Err("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.".to_string());
        }
    };

    // --- DB Call ---
    match db.create_user_with_invite(&username, &password_hash, &invite_code).await {
        Ok(new_id) => {
            let success_message = format!("¡Usuario '{}' registrado con éxito con el ID {}!", username, new_id);
            info!("{}", success_message);
            Ok(success_message)
        },
        Err(sqlx::Error::RowNotFound) => {
            // Invitation code not valid
            Err("El código de invitación no es válido o ya ha sido utilizado.".to_string())
        },
        Err(e) => {
            error!("Error de base de datos durante el registro de '{}': {}", username, e);
            Err("Ocurrió un error al registrar la cuenta. Por favor, contacta con soporte.".to_string())
        }
    }
}

#[tauri::command]
async fn check_session(pool: tauri::State<'_, Arc<sqlx::MySqlPool>>) -> Result<Option<SessionInfo>, String> {
    match session_manager::SessionManager::get_token_from_keyring() {
        Ok(Some(token)) => {
            let session_manager = session_manager::SessionManager::new(pool.inner().as_ref().clone());

            match session_manager.validate_token(&token).await {
                Ok(Some((user_id, username))) => {
                    // Devolvemos la estructura completa
                    Ok(Some(SessionInfo { user_id, username }))
                },
                Ok(None) => Ok(None),
                Err(e) => Err(format!("Error validando sesión: {}", e))
            }
        }
        Ok(None) => {
            info!("No hay token guardado en el keyring");
            Ok(None)
        }
        Err(e) => {
            error!("Error leyendo token del keyring: {}", e);
            Ok(None)
        }
    }
}

#[tauri::command]
async fn logout(pool: tauri::State<'_, Arc<sqlx::MySqlPool>>) -> Result<(), String> {
    if let Ok(Some(token)) = session_manager::SessionManager::get_token_from_keyring() {
        let session_manager = session_manager::SessionManager::new(pool.inner().as_ref().clone());
        session_manager.delete_session(&token)
            .await
            .map_err(|e| format!("Error cerrando sesión: {}", e))
    } else {
        info!("No hay sesión activa para cerrar");
        Ok(())
    }
}

#[tauri::command]
async fn load_user_data(
    username: String,
    db: tauri::State<'_, DbManager>
) -> Result<db_manager::UserData, String> {
    db.load_user_data(&username)
        .await
        .map_err(|e| format!("Error cargando datos del usuario: {}", e))
}

/**
 * Keyring is generating and storing the session tokens securely in the Database but not in the system keyring.
 * This is done because is failing XD. Have to re-check later.
 */
#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let options = LauncherOptions::new();
    let game_options = GameOptions::new();

    // Logger setup
    if let Err(e) = setup_logger(&options) {
        eprintln!("Error while setting up the logger: {}", e);
    }

    info!("Iniciando aplicación");

    if !options.is_json_present() {
        info!("Options file not found, creating a new one with default settings");
        options.save();
    }

    if !GameOptions::is_json_present(options.clone()) {
        info!("Game Options file not found, creating a new one with default settings");
        game_options.save(options.clone());
    }

    // --- DATABASE CONNECTION ---
    dotenvy::dotenv().ok();
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be defined .env");

    let db_manager = match DbManager::new(&db_url).await {
        Ok(manager) => manager,
        Err(e) => {
            error!("We couldn't establish connection to the database: {}", e);
            return;
        }
    };

    // Crear pool adicional para gestión de sesiones
    let pool = match sqlx::MySqlPool::connect(&db_url).await {
        Ok(p) => Arc::new(p),  // Envolver en Arc
        Err(e) => {
            error!("Error while creating the connection pool: {}", e);
            return;
        }
    };

    info!("Conexión a la base de datos establecida con éxito.");

    let mut java_installed = check_java_version("21");
    info!("Is Java 21 installed? {}", java_installed);
    // Check if Java 21 is installed and install it if not present
    if !java_installed {
        info!("Java 21 not found, trying to install it...");
        let java_version = "21";

        // Show info window on start-up
        if let Err(e) = Command::new("cmd")
            .args(&["/C", "start", "cmd", "/C", "echo Java 21 has not been found on your system, trying to install it... We will notify you once the proccess is completed & pause"])
            .spawn() {
            error!("No se pudo mostrar ventana informativa: {}", e);
        }

        // Get main disk
        let main_disk = std::env::var("SystemDrive").unwrap_or_else(|_| "C:".into());
        info!("Main disk: {}", main_disk);

        // Get %temp% dir
        let temp_dir = std::env::var("TEMP").unwrap_or_else(|_| format!("{}\\Temp", main_disk).into());
        info!("Temp dir: {}", temp_dir);

        let download_path = format!("{}\\java_download.zip", temp_dir);
        let extract_path = format!("{}\\extracted_java", temp_dir);

        // Get Program Files dir if not present use main disk/java
        let program_files = std::env::var("ProgramFiles").unwrap_or_else(|_| format!("{}\\Java", main_disk));
        let install_path = format!("{}\\Java\\jdk-{}", program_files, java_version);

        // Install java
        let mut setup = JavaSetup::new(java_version, &download_path, &extract_path, &install_path);

        match setup.setup().await {
            Ok(_) => {
                info!("Java 21 installation completed successfully");
                // Verify installation
                java_installed = check_java_version("21");
                info!("Java 21 verification after installation: {}", java_installed);

                // Mostrar ventana de éxito
                if let Err(e) = Command::new("cmd")
                    .args(&["/C", "start", "cmd", "/C", "echo Java 21 have been installed correctly. & echo The Launcher will shutdown, please re-open it. & pause"])
                    .spawn() {
                    error!("No se pudo mostrar ventana informativa de éxito: {}", e);
                }
            },
            Err(e) => {
                error!("Error during Java setup: {}", e);
                eprintln!("Error durante la configuración de Java: {}", e);

                // Mostrar ventana de error
                if let Err(e) = Command::new("cmd")
                    .args(&["/C", "start", "cmd", "/C", "echo An error occurred during the installation of Java 21. & echo The program will try to continue, but it may not work properly. \
                     Even though it might be an error, try re-launching the app. If the problem persists, contact support & pause"])
                    .spawn() {
                    error!("No se pudo mostrar ventana informativa de error: {}", e);
                }
            }
        }
    }

    if java_installed {
        info!("Setting up Tauri application");
        tauri::Builder::default()
            .plugin(tauri_plugin_dialog::init())
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_opener::init())
            .manage(db_manager)
            .manage(pool)
            .invoke_handler(tauri::generate_handler![
            read_options,
            save_options,
            return_default_game_dir,
            read_game_options,
            get_garbage_collectors,
            get_base_jvm_flags,
            save_game_options,
            login_user,
            register_user,
            check_session,
            logout,
            load_user_data
        ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    } else {
        // Show an error message and exit if Java could not be installed
        error!("No se pudo instalar Java 21. La aplicación no puede continuar.");

        // Error message in a new cmd window
        if let Err(e) = Command::new("cmd")
            .args(&["/C", "start", "cmd", "/C", "echo La aplicación requiere Java 21 para funcionar. Por favor, instale Java 21 e intente nuevamente. & pause"])
            .spawn() {
            error!("No se pudo mostrar mensaje de error: {}", e);
        }
    }
}

fn check_java_version(target_version: &str) -> bool {
    let output = Command::new("java")
        .arg("-version")
        .output();

    match output {
        Ok(output) => {
            // java -version sends output to stderr, not stdout
            let version_output = String::from_utf8_lossy(&output.stderr);

            // Search for the version in the output
            version_output.contains(target_version)
        },
        Err(_) => false, // Java is not installed
    }
}