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

// Event listener for the "Save Changes" button
document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('#apply_vm_changes')) {
        const max_ram_input = document.getElementById("max_ram") as HTMLInputElement;
        const jvm_args_input = document.getElementById("jvm_args") as HTMLInputElement;
        const gc_select = document.getElementById("gc_select") as HTMLSelectElement;
        const custom_java_version = document.getElementById("java_version") as HTMLInputElement;

        // Check if max_ram_input is a valid number
        const max_ram = parseInt(max_ram_input.value);
        if (isNaN(max_ram) || max_ram <= 0) {
            await message('Please enter a valid positive number for maximum RAM.', { title: 'Invalid Input', kind: 'error' });
            return;
        }

        // Check if the new values are different from the current ones
        const newJvmFlags = jvm_args_input.value.split(" ").filter(flag => flag.trim() !== "");
        const newGc = gc_select.value;
        const newJavaPath = custom_java_version.value.trim();

        if (max_ram === game_options.max_ram &&
            JSON.stringify(newJvmFlags) === JSON.stringify(game_options.vm_flags) &&
            newGc === game_options.garbage_collector &&
            newJavaPath === game_options.custom_java_path) {
            await message('No changes detected in game options.', { title: 'No Changes', kind: 'info' });
            return;
        }

        // Save the current state of the form fields to the game_options object
        game_options.max_ram = max_ram;
        game_options.vm_flags = newJvmFlags;
        game_options.garbage_collector = newGc;
        game_options.custom_java_path = newJavaPath;

        invoke('save_game_options', { gameOptions: game_options, launcherOptions: options }).then(async (status) => {
            if (status) {
                console.log("Game options saved successfully.");
                await message('Game options saved successfully', { title: 'Save Game Options', kind: 'info' });
            } else {
                console.error("Failed to save game options.");
                await message('Failed to save game options. If you think this is an error, please report it.', { title: 'Save Game Options', kind: 'error' });
            }
        });
    }
})