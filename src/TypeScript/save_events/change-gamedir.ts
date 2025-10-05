// This file is responsible for handling the change game directory button event

import { options } from '../main.ts';
import { open } from '@tauri-apps/plugin-dialog'
import { message } from '@tauri-apps/plugin-dialog';

document.addEventListener('click', async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('#change_game_dir')) {
        console.log("Change game dir");
        const gameDir = await open({
            multiple: false,
            directory: true,
        });
        options.game_dir = gameDir as string | undefined;
        if (options.game_dir) {
            (document.getElementById("game_dir") as HTMLInputElement).value = options.game_dir;
            console.log("Game dir changed to: " + options.game_dir);
        } else {
            console.error("Failed to change game dir.");
            await message('An error occurred while selecting the directory', { title: 'Change Game Directory', kind: 'error'});
        }
    }
});