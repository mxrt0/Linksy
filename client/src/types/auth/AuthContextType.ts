import type { LoginRequest } from "./LoginRequest";
import type { RegisterRequest } from "./RegisterRequest";
import type { ProfileSettings, UpdateProfileRequest } from "./ProfileSettings";
import type { User } from "./User";

export interface AuthContextType {
    user: User | null;
    profile: ProfileSettings | null;
    authLoading: boolean;
    register: (request: RegisterRequest) => Promise<void>
    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (request: UpdateProfileRequest) => Promise<void>;
}

