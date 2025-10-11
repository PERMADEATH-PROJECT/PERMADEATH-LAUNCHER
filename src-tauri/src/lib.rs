mod options;

use options::{launcher_options::LauncherOptions, game_options::GameOptions};
use chrono::Local;
use log::{info, error, LevelFilter};
use simplelog::{WriteLogger, Config, CombinedLogger, TermLogger, TerminalMode, ColorChoice};
use std::fs::{File, create_dir_all};
use std::process::Command;
use launcher_java_installer::JavaSetup;
use crate::options::game_options::{GarbageCollector, BASE_VM_FLAGS};

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

    let mut java_installed = check_java_version("21");
    info!("Is Java 21 installed? {}", java_installed);
    // Check if Java 21 is installed and install it if not present
    if !java_installed {
        info!("Java 21 not found, trying to install it...");
        let java_version = "21";

        // Show info window on start-up
        if let Err(e) = Command::new("cmd")
            .args(&["/C", "start", "cmd", "/C", "echo Java 21 has not been found on your system, trying to install it... & pause"])
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
                    .args(&["/C", "start", "cmd", "/C", "echo Ha ocurrido un error durante la instalación de Java 21. & echo El programa intentará continuar, pero podría no funcionar correctamente. & pause"])
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
            .invoke_handler(tauri::generate_handler![
            read_options,
            save_options,
            return_default_game_dir,
            read_game_options,
            get_garbage_collectors,
            get_base_jvm_flags,
            save_game_options
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