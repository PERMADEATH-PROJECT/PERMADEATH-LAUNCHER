export type UserData = {
    status: boolean;
    survived_days: number;
    last_login: string;
    server_role: string;
    username: string; // Add username for identification
};

// This variable stores the current user (simple singleton)
let currentUser: UserData | null = null;

export function setUser(data: UserData | null) {
    currentUser = data;
}

export function getUser(): UserData | null {
    return currentUser;
}

export function isUserLoggedIn(): boolean {
    return currentUser !== null;
}