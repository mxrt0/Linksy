export const TrafficSource = {
    Google: "Google",
    TwitterX: "Twitter/X",
    Discord: "Discord",
    QR: "QR",
    Direct: "Direct",
    Other: "Other"
} as const;

export type TrafficSource = typeof TrafficSource[keyof typeof TrafficSource];