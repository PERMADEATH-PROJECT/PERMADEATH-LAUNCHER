mod options;

use options::launcher_option_handler::LauncherOptions;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_options() -> LauncherOptions {
    // Load options from a JSON file in the launcher directory to the struct
    LauncherOptions::load()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Try to load existing options and if not present, create new ones
    // Create a new instance of LauncherOptions and save it
    let options = LauncherOptions::new();
    if !LauncherOptions::is_json_present(&options) {
        options.save();
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![read_options])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
