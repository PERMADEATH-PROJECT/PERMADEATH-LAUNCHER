import { invoke } from "@tauri-apps/api/core";
import { loadUserData } from "./data/load-user-data.ts";
import { setUser, UserData } from "./state/user-store.ts";

// Definimos el tipo que ahora devuelve el backend
type SessionInfo = {
    user_id: number;
    username: string;
};

export async function checkAutoLogin(): Promise<boolean> {
    try {
        const session = await invoke<SessionInfo | null>('check_session');

        if (session) {
            console.log('Auto-login successful for:', session.username);

            const userData = await loadUserData(session.username);

            if (userData) {
                const fullUserData: UserData = { ...userData, username: session.username };

                setUser(fullUserData);
                console.log("User data stored in global state from Auto-Login");
            }

            return true;
        }

        console.log('No valid session found for auto-login.');
        return false;
    } catch (error) {
        console.error('Error checking auto-login status:', error);
        return false;
    }
}