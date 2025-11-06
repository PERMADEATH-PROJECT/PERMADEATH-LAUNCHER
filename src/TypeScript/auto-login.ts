import { invoke } from "@tauri-apps/api/core";

export async function checkAutoLogin(): Promise<boolean> {
    try {
        const userId = await invoke<number | null>('check_session');

        if (userId) {
            console.log('Auto-login successful for user ID:', userId);
            return true;
        }

        console.log('No valid session found for auto-login.');
        return false;
    } catch (error) {
        console.error('Error checking auto-login status:', error);
        return false;
    }
}