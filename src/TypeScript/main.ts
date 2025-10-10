import "../css-imports.ts"
import { invoke } from "@tauri-apps/api/core";
import { exit } from '@tauri-apps/plugin-process';

let options: LauncherOptions;
let game_options: GameOptions;

type LauncherOptions = {
    launcher_dir?: string;
    game_dir?: string;
    init_on_start: boolean;
    auto_update: boolean;
    notification_enabled: boolean;
    debug_console: boolean;
    automatic_backup: boolean;
};

type GameOptions = {
    max_ram: number;
    vm_flags: string[];
    garbage_collector: string;
    custom_java_path: string;
}

async function read_options() {
    options = await invoke<LauncherOptions>('read_options');
}

async function read_game_options(launcherOptions?: LauncherOptions) {
    game_options = await invoke<GameOptions>('read_game_options', { launcherOptions: launcherOptions });
}

window.addEventListener("DOMContentLoaded", async () => {
    console.log("Loading options...");
    try {
        // Wait till operations are completed
        await read_options();
        console.log("Launcher options loaded.");
        console.log('Launcher Options:', options);

        if (!options) {
            console.error("Failed to load launcher options.");
            await exit(0);
            return;
        }

        console.log("Loading game options...");
        await read_game_options(options);
        console.log("Game options loaded.");
        console.log('Game Options:', game_options);

        if (!game_options) {
            console.error("Failed to load game options.");
            await exit(0);
        }
    } catch (error) {
        console.error("Error loading options:", error);
        await exit(1);
    }
});
export { options, game_options };