use std::fs::{write, create_dir_all};
use dirs_next::config_dir;
use log::{info, error};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct LauncherOptions {
    pub launcher_dir: Option<std::path::PathBuf>,
    pub game_dir: Option<std::path::PathBuf>,
    pub init_on_start: bool,
    pub auto_update: bool,
    pub notification_enabled: bool,
    pub debug_console: bool,
    automatic_backup: bool,
}

impl LauncherOptions {
    pub fn new() -> Self {
        let launcher_dir = config_dir().map(|mut path| {
            path.push(".Permadeath-Launcher");
            info!("Launcher directory configured at: {:?}", path);
            path
        });

        let game_dir = dirs_next::data_dir().map(|mut path| {
            path.push(".Permadeath");
            info!("Game directory configured at: {:?}", path);
            path
        });

        Self {
            launcher_dir,
            game_dir,
            init_on_start: false,
            auto_update: true,
            notification_enabled: false,
            debug_console: false,
            automatic_backup: true,
        }
    }

    pub fn save(&self) {
        if let Some(dir) = &self.launcher_dir {
            let options_path = dir.join("options.json");
            info!("Trying to save options at: {:?}", options_path);
            let json = match serde_json::to_string_pretty(self) {
                Ok(j) => j,
                Err(_) => {
                    error!("Could not serialize options to JSON.");
                    return;
                }
            };
            if let Err(e) = create_dir_all(dir) {
                error!("Failed to create config directory: {}", e);
                return;
            }
            info!("Config directory created or already exists: {:?}", dir);
            if let Err(e) = write(&options_path, json) {
                error!("Failed to write options file: {}", e);
                return;
            }
            info!("Options saved successfully at: {:?}", options_path);
            return;
        }
        info!("Launcher directory is not configured.");
    }

    pub fn load() -> Self {
        let default_options = Self::new();
        if let Some(dir) = &default_options.launcher_dir {
            let options_path = dir.join("options.json");
            info!("Trying to load options from: {:?}", options_path);
            let data = match std::fs::read_to_string(&options_path) {
                Ok(d) => d,
                Err(_) => {
                    info!("Options file not found, using default values.");
                    return default_options;
                }
            };
            info!("Options file found, trying to deserialize...");
            let options = match serde_json::from_str::<LauncherOptions>(&data) {
                Ok(o) => o,
                Err(_) => {
                    error!("Could not deserialize options file.");
                    return default_options;
                }
            };
            info!("Options loaded successfully.");
            return options;
        }
        info!("Launcher directory is not configured, using default values.");
        default_options
    }

    pub fn is_json_present(&self) -> bool {
        if let Some(dir) = &self.launcher_dir {
            let options_path = dir.join("options.json");
            let exists = options_path.exists();
            info!("Is the options file present? {} at {:?}", exists, options_path);
            return exists;
        }
        info!("Launcher directory is not configured to check the file.");
        false
    }

    pub fn get_default_game_dir() -> Option<std::path::PathBuf> {
        dirs_next::data_dir().map(|mut path| {
            path.push(".Permadeath");
            path
        })
    }
}