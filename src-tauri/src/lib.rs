mod options;

use options::launcher_option_handler::LauncherOptions;
use chrono::Local;
use log::{info, error, LevelFilter};
use simplelog::{WriteLogger, Config, CombinedLogger, TermLogger, TerminalMode, ColorChoice};
use std::fs::{File, create_dir_all};

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
            // Log a consola
            TermLogger::new(
                LevelFilter::Info,
                Config::default(),
                TerminalMode::Mixed,
                ColorChoice::Auto
            ),
            // Log a archivo
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
    info!("Cargando opciones");
    let options = LauncherOptions::load();
    info!("Opciones cargadas: {:?}", options);
    options
}

#[tauri::command]
fn save_options(options: LauncherOptions) -> bool {
    info!("Guardando opciones: {:?}", options);
    options.save();
    info!("Opciones guardadas exitosamente");
    true
}

#[tauri::command]
fn return_default_game_dir() -> String {
    info!("Obteniendo directorio de juego predeterminado");
    LauncherOptions::get_default_game_dir()
        .map(|path| path.to_string_lossy().into_owned())
        .unwrap_or_default().into()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let options = LauncherOptions::new();

    // Logger setup
    if let Err(e) = setup_logger(&options) {
        eprintln!("Error al configurar el logger: {}", e);
    }

    info!("Iniciando aplicación");

    if !options.is_json_present() {
        info!("Archivo de opciones no encontrado, creando uno nuevo con configuración predeterminada");
        options.save();
    }

    info!("Configurando Tauri Builder");
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_options,
            save_options,
            return_default_game_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}