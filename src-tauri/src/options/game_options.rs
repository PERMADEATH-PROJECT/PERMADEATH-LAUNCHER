use std::fs::{create_dir_all, write};
use log::{error, info};
use crate::options::launcher_options::LauncherOptions;

const BASE_VM_FLAGS: [&str; 10] = [
    "-XX:MaxGCPauseMillis=100",
    "-XX:G1NewSizePercent=30",
    "-XX:G1ReservePercent=20",
    "-XX:+UseStringDeduplication",
    "-XX:G1HeapRegionSize=32M",
    "-XX:+TieredCompilation",
    "-XX:+AlwaysPreTouch",
    "-Dsun.java2d.opengl=true",
    "-Xverify:none",
    "-XX:+UnlockExperimentalVMOptions"
];

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub enum GarbageCollector {
    Serial,
    Parallel,
    G1GC,
    ZGC,
    Shenandoah,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct GameOptions {
    max_ram: u32,
    vm_flags: Vec<String>,
    garbage_collector: GarbageCollector,
    custom_java_path: Option<String>,
}

impl GameOptions {
    pub fn new() -> Self {
        Self {
            max_ram: 4096, // Default to 4096 MB
            vm_flags: BASE_VM_FLAGS.iter().map(|s| s.to_string()).collect(),
            garbage_collector: GarbageCollector::G1GC,
            custom_java_path: None,
        }
    }

    pub fn get_max_ram(&self) -> u32 {
        self.max_ram
    }

    pub fn get_vm_flags(&self) -> Vec<String> {
        let mut flags = self.vm_flags.clone();
        // push the garbage collector flag at the end
        let gc_flag = match self.garbage_collector {
            GarbageCollector::Serial => "-XX:+UseSerialGC",
            GarbageCollector::Parallel => "-XX:+UseParallelGC",
            GarbageCollector::G1GC => "-XX:+UseG1GC",
            GarbageCollector::ZGC => "-XX:+UseZGC",
            GarbageCollector::Shenandoah => "-XX:+UseShenandoahGC",
        };
        flags.push(gc_flag.into());
        flags
    }

    pub fn set_max_ram(&mut self, ram_mb: u32) {
        self.max_ram = ram_mb;
    }

    pub fn add_vm_flag(&mut self, flag: String) {
        if !self.vm_flags.contains(&flag) {
            self.vm_flags.push(flag);
        }
    }

    pub fn get_custom_java_path(&self) -> Option<String> {
        self.custom_java_path.clone()
    }

    pub fn remove_vm_flag(&mut self, flag: &str) {
        self.vm_flags.retain(|f| f != flag);
    }

    pub fn set_custom_java_path(&mut self, path: Option<String>) {
        self.custom_java_path = path;
    }

    pub fn set_garbage_collector(&mut self, gc: GarbageCollector) {
        self.garbage_collector = gc;
    }

    pub fn save(&self, launcher_options: LauncherOptions) {
        info!("Saving game options: {:?}", self);
        if let Some(dir) = launcher_options.launcher_dir {
            let options_path = dir.join("game_options.json");
            let json = match serde_json::to_string_pretty(self) {
                Ok(j) => j,
                Err(e) => {
                    error!("Failed to serialize game options: {}", e);
                    return;
                }
            };
            if let Err(e) = create_dir_all(dir) {
                error!("Failed to create config directory: {}", e);
                return;
            }
            info!("Config directory created or already exists.");
            if let Err(e) = write(&options_path, json) {
                error!("Failed to write game options file: {}", e);
                return;
            }
            info!("Game options saved successfully at: {:?}", options_path);
            return;
        }
        info!("Launcher directory is not configured.");
    }

    pub fn load(launcher_options: LauncherOptions) -> Self {
        if let Some(dir) = launcher_options.launcher_dir {
            let options_path = dir.join("game_options.json");
            info!("Trying to load game options from: {:?}", options_path);
            if let Ok(data) = std::fs::read_to_string(&options_path) {
                match serde_json::from_str::<GameOptions>(&data) {
                    Ok(options) => {
                        info!("Game options loaded successfully: {:?}", options);
                        return options;
                    }
                    Err(e) => {
                        error!("Failed to parse game options JSON: {}", e);
                    }
                }
            } else {
                info!("Game options file does not exist, using defaults.");
            }
        } else {
            info!("Launcher directory is not configured, using default game options.");
        }
        Self::new()
    }

    pub fn is_json_present(launcher_options: LauncherOptions) -> bool {
        if let Some(dir) = launcher_options.launcher_dir {
            let options_path = dir.join("game_options.json");
            let exists = options_path.exists();
            info!("Game options JSON presence: {}", exists);
            return exists;
        }
        info!("Launcher directory is not configured, game options JSON cannot be present.");
        false
    }

    pub fn get_garbage_collectors() -> Vec<GarbageCollector> {
        vec![
            GarbageCollector::Serial,
            GarbageCollector::Parallel,
            GarbageCollector::G1GC,
            GarbageCollector::ZGC,
            GarbageCollector::Shenandoah,
        ]
    }
}