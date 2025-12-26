import {invoke} from "@tauri-apps/api/core";

type data = {
    status: boolean;
    survived_days: number;
    last_login: string;
    server_role: string;
}

export async function loadUserData(username: string): Promise<data | null> {
    try {
        const userData = await invoke<data>('load_user_data', {username});

        if (userData && userData.status) {
            console.log('User data loaded successfully:', userData);
            return userData;
        } else {
            console.error('Failed to load user data or data is invalid.');
            return null;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}