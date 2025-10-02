// Este archivo gestiona los eventos de los botones "Restablecer" y "Guardar Cambios" en el dashboard de configuración.

import { options } from '../main.ts';
import {invoke} from "@tauri-apps/api/core";

// Evento para el botón "Restablecer"
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const dashboard = document.getElementById('dashboard') as HTMLElement;
    if (target.matches('button[type="reset"]')) {
        // Restablecer los valores de los checkboxes a los valores por defecto
        (document.getElementById("auto_init") as HTMLInputElement).checked = false;
        (document.getElementById("debug_console") as HTMLInputElement).checked = false;
        (document.getElementById("automatic_backup") as HTMLInputElement).checked = true;

        options.init_on_start = false;
        options.debug_console = false;
        options.automatic_backup = true;

        invoke('save_options', {options: options}).then((status) => {
            if (status) {
                console.log("Options saved successfully.");
                dashboard.insertAdjacentHTML("beforeend", "Options reset to default values.");
            } else {
                console.error("Failed to save options.");
                dashboard.insertAdjacentHTML("beforeend", "Failed to reset options. If you think this is an error, please report it.");
            }
        });
    }
});

// Evento para el botón "Guardar Cambios"
document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const dashboard = document.getElementById('dashboard') as HTMLElement;
    if (form.classList.contains('config-grid')) {
        e.preventDefault();
        // Guardar los valores actuales en el objeto options
        options.init_on_start = (document.getElementById("auto_init") as HTMLInputElement).checked;
        options.debug_console = (document.getElementById("debug_console") as HTMLInputElement).checked;
        options.automatic_backup = (document.getElementById("automatic_backup") as HTMLInputElement).checked;
        // Aquí podrías agregar lógica para persistir los cambios (por ejemplo, localStorage o IPC)
        invoke('save_options', {options: options}).then((status) => {
            if (status) {
                console.log("Options saved successfully.");
                dashboard.insertAdjacentHTML("beforeend", "Options saved successfully.");
            } else {
                console.error("Failed to save options.");
                dashboard.insertAdjacentHTML("beforeend", "Failed to save options. If you think this is an error, please report it.");
            }
        });
    }
});