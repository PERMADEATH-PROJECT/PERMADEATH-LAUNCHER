import { options } from '../main.ts';
import { invoke } from "@tauri-apps/api/core";
import { message } from '@tauri-apps/plugin-dialog';

document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('#auto_update_btn')) {
        console.log("Toggling Automatic Updates...");
        options.auto_update = !options.auto_update;
        invoke('save_options', {options: options}).then(async (status) => {
            if (status) {
                const auto_update_btn = document.getElementById("auto_update_btn");
                if (auto_update_btn) {
                    if (!options.auto_update) {
                        auto_update_btn.classList.remove("updates-btn--green");
                        auto_update_btn.classList.add("updates-btn--white");
                        auto_update_btn.textContent = "Deshabilitado";
                    } else {
                        auto_update_btn.classList.add("updates-btn--green");
                        auto_update_btn.classList.remove("updates-btn--white");
                        auto_update_btn.textContent = "Habilitado";
                    }
                }

                console.log("Automatic Updates toggled saved successfully.");
                await message('Automatic Updates toggled saved successfully', { title: 'Automatic Updates', kind: 'info'});
            } else {
                console.error("Failed to save options.");
                await message('Failed to toggle updates. If you think this is an error, please report it.', { title: 'Automatic Updates', kind: 'error'});
            }
        });
    }
})

document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('#notifications_btn')) {
        console.log("Toggling Notifications...");
        options.notification_enabled = !options.notification_enabled;
        invoke('save_options', {options: options}).then(async (status) => {
            if (status) {
                const notifications_btn = document.getElementById("notifications_btn");
                if (notifications_btn) {
                    if (!options.notification_enabled) {
                        notifications_btn.classList.remove("updates-btn--green");
                        notifications_btn.classList.add("updates-btn--white");
                        notifications_btn.textContent = "Deshabilitadas";
                    } else {
                        notifications_btn.classList.add("updates-btn--green");
                        notifications_btn.classList.remove("updates-btn--white");
                        notifications_btn.textContent = "Habilitadas";
                    }
                }

                console.log("Notifications toggled saved successfully.");
                await message('Notifications toggled saved successfully', { title: 'Notifications', kind: 'info'});
            } else {
                console.error("Failed to save options.");
                await message('Failed to toggle notifications. If you think this is an error, please report it.', { title: 'Notifications', kind: 'error'});
            }
        });
    }
})