mod options;
use options::launcher_option_handler::LauncherOptions;

// Previene una ventana de consola adicional en Windows en release, ¡NO REMOVER!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    permadeath_launcher_lib::run();
}