use tauri_api::dialog;
use std::path::PathBuf;

/// Abre un diálogo de selección de carpeta y devuelve la ruta elegida
pub async fn select_directory() -> Option<PathBuf> {
    dialog::pick_folder(None).await
}

/// Abre un diálogo de selección de carpeta y ejecuta un callback con la ruta
pub fn open_folder_dialog<F>(callback: F)
where
    F: FnOnce(Option<PathBuf>) + Send + 'static,
{
    tauri::async_runtime::spawn(async move {
        let selected_path = dialog::pick_folder(None).await;
        callback(selected_path);
    });
}