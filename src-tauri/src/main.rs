#[cfg_attr(all(not(debug_assertions)), windows_subsystem = "windows")]

mod options;

fn main() {
    permadeath_launcher_lib::run();
}