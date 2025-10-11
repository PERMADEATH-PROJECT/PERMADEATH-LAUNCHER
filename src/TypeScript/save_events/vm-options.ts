import { game_options, options } from '../main.ts';
import { invoke } from "@tauri-apps/api/core";
import { message } from '@tauri-apps/plugin-dialog';

// Event listener for the "Reset" button
document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('#default_flags_button')) {
        const defaultJvmArgs = await invoke<string[]>('get_base_jvm_flags');
        const gc_select = document.getElementById("gc_select") as HTMLSelectElement;
        // Restart the form fields to their default values
        (document.getElementById("jvm_args") as HTMLInputElement).value = defaultJvmArgs.join(" ");

        game_options.vm_flags = defaultJvmArgs;

        if (game_options.garbage_collector) {
            console.log("Selecting current GC: " + game_options.garbage_collector);
            gc_select.value = game_options.garbage_collector;
        }

        invoke('save_game_options', { gameOptions: game_options, launcherOptions: options }).then(async (status) => {
            if (status) {
                console.log("Game options reset successfully.");
                await message('Game options reset successfully', { title: 'Reset Game Options', kind: 'info' });
            } else {
                console.error("Failed to reset game options.");
                await message('Failed to reset game options. If you think this is an error, please report it.', { title: 'Reset Game Options', kind: 'error' });
            }
        });
    }
});