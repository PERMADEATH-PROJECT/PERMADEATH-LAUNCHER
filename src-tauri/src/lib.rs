mod options;

use options::launcher_option_handler::LauncherOptions;

#[tauri::command]
fn read_options() -> LauncherOptions {
    // Load options from a JSON file in the launcher directory to the struct
    LauncherOptions::load()
}

/// Save options from the struct to a JSON file in the launcher directory
#[tauri::command]
fn save_options(options: LauncherOptions) -> bool {
    println!("Saving options: {:?}", options);
    options.save();
    println!("Saved options: {:?}", options);
    // Return true if save was successful
    true.into()
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Try to load existing options and if not present, create new ones
    // Create a new instance of LauncherOptions and save it
    let options = LauncherOptions::new();
    if !LauncherOptions::is_json_present(&options) {
        println!("Options file not found, creating a new one with default settings.");
        options.save();
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_options, save_options])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
