// This file handles the events for saving and resetting configuration options in the application.

import { options } from '../main.ts';
import { invoke } from "@tauri-apps/api/core";
import { message } from '@tauri-apps/plugin-dialog';

// Event listener for the "Reset" button
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('#config_reset')) {
        invoke('return_default_game_dir').then((game_dir) => {
            console.log("Default game directory retrieved: " + game_dir);

            // Restart the form fields to their default values
            (document.getElementById("auto_init") as HTMLInputElement).checked = false;
            (document.getElementById("debug_console") as HTMLInputElement).checked = false;
            (document.getElementById("automatic_backup") as HTMLInputElement).checked = true;
            // @ts-ignore
            (document.getElementById("game_dir") as HTMLInputElement).value = game_dir;

            options.init_on_start = false;
            options.debug_console = false;
            options.automatic_backup = true;
            // @ts-ignore
            options.game_dir = game_dir;

            invoke('save_options', {options: options}).then(async (status) => {
                if (status) {
                    console.log("Options saved successfully.");
                    await message('Options reset successfully', { title: 'Reset Options', kind: 'info'});
                } else {
                    console.error("Failed to save options.");
                    await message('Failed to reset options. If you think this is an error, please report it.', { title: 'Reset Options', kind: 'error'});
                }
            });
        });
    }
});

// Event listener for the "Save Changes" button
document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (form.classList.contains('config-grid')) {
        e.preventDefault();
        // Save the current state of the form fields to the options object
        options.init_on_start = (document.getElementById("auto_init") as HTMLInputElement).checked;
        options.debug_console = (document.getElementById("debug_console") as HTMLInputElement).checked;
        options.automatic_backup = (document.getElementById("automatic_backup") as HTMLInputElement).checked;

        // Save the game directory only if it's not empty
        invoke('save_options', {options: options}).then(async (status) => {
            if (status) {
                console.log("Options saved successfully.");
                await message('Options saved successfully', { title: 'Save Options', kind: 'info'});
            } else {
                console.error("Failed to save options.");
                await message('Failed to save options. If you think this is an error, please report it.', { title: 'Save Options', kind: 'error'});
            }
        });
    }
});