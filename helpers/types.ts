export interface UserAuthData {
    id: string;
    accessToken: string;
    userId: string;
    role: string;
    allowedRoles: string[];
    access: number;
    exp: number;
}

export interface UserSession {
    status: "unauthenticated" | "authenticated" | "loading";
    data: { expires: string; user: UserAuthData };
}

export interface User {
    id: string;
    email: string;
    name: string;
    telegramId: string;
    telegramUsername: string;
    roles: { defaultRole: string; allowedRoles: string[] };
    access: number;
    status: number;
    settings: {
        notifications: {
            news: {
                email: boolean;
                telegram: boolean;
            };
            trading: {
                email: boolean;
                telegram: boolean;
            };
            signals: {
                email: boolean;
                telegram: boolean;
            };
        };
    };
}
