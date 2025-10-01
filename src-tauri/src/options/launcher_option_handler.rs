use std::fs::{write, create_dir_all};
use dirs_next::config_dir;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct LauncherOptions {
    #[serde(skip_serializing, skip_deserializing)]
    pub launcher_dir: Option<std::path::PathBuf>,
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
            path
        });

        Self {
            launcher_dir,
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
            if let Ok(json) = serde_json::to_string_pretty(self) {
                if let Err(e) = create_dir_all(dir) {
                    eprintln!("Failed to create config directory: {}", e);
                    return;
                }
                if let Err(e) = write(&options_path, json) {
                    eprintln!("Failed to write options file: {}", e);
                }
            }
        }
    }

    pub fn load() -> Self {
        // Load options from a JSON file in the launcher directory to the struct
        let default_options = Self::new();
        if let Some(dir) = &default_options.launcher_dir {
            let options_path = dir.join("options.json");
            if let Ok(data) = std::fs::read_to_string(&options_path) {
                if let Ok(options) = serde_json::from_str::<LauncherOptions>(&data) {
                    return options;
                }
            }
        }

        default_options
    }

    pub fn is_json_present(&self) -> bool {
        if let Some(dir) = &self.launcher_dir {
            let options_path = dir.join("options.json");
            return options_path.exists();
        }
        false
    }
}