export type AliasCheckResult = {
  isAvailable: boolean;
  reason?: AliasUnavailableReason;
  suggestions?: string[];
};

type AliasUnavailableReason = 
'Taken' |
'InvalidFormat' |
'Reserved' |
'TooShort' |
'TooLong' | 
'Profanity' |
'Blacklisted' |
'Unknown'