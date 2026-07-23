export interface ProfileSettings {
  displayName: string;
  userName?: string | null;
  email?: string | null;
  defaultAnalyticsRange: number;
  weeklySummaryEnabled: boolean;
  expiryReminderEnabled: boolean;
  creationDate?: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  defaultAnalyticsRange: number;
  weeklySummaryEnabled: boolean;
  expiryReminderEnabled: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
