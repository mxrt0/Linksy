import type { LoginRequest } from "./LoginRequest";
import type { RegisterRequest } from "./RegisterRequest";
import type { User } from "./User";

export interface AuthContextType {
    user: User | null;
    register: (request: RegisterRequest) => Promise<void>
    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

