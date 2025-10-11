mod options;

use options::{launcher_options::LauncherOptions, game_options::GameOptions};
use chrono::Local;
use log::{info, error, LevelFilter};
use simplelog::{WriteLogger, Config, CombinedLogger, TermLogger, TerminalMode, ColorChoice};
use std::fs::{File, create_dir_all};
use crate::options::game_options::GarbageCollector;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
            get_garbage_collectors
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}