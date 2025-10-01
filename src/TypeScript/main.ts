import { invoke } from "@tauri-apps/api/core";
import "../css-imports.ts"

let options: LauncherOptions;

type LauncherOptions = {
    launcher_dir?: string;
    init_on_start: boolean;
    auto_update: boolean;
    notification_enabled: boolean;
    debug_console: boolean;
    automatic_backup: boolean;
};

async function read_options() {
    options = await invoke<LauncherOptions>("read_options");
    console.log(options);
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("Cargando opciones...");
  read_options().then(() => {
    console.log("Opciones cargadas.");
  });
});

export { options };