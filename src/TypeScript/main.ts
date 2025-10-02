import "../css-imports.ts"
import { invoke } from "@tauri-apps/api/core";

let options: LauncherOptions;

type LauncherOptions = {
    launcher_dir?: string;
    game_dir?: string;
    init_on_start: boolean;
    auto_update: boolean;
    notification_enabled: boolean;
    debug_console: boolean;
    automatic_backup: boolean;
};

async function read_options() {
    options = await invoke<LauncherOptions>("read_options");
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("Loading options...");
  read_options().then(() => {
    console.log("Options loaded.");
  });
});

export { options };