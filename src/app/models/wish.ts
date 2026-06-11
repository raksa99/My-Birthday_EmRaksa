export interface Wish {
  id: string;
  sender: string;
  message: string;
  timestamp: string; // ISO String format
  avatarSeed: number; // Seed to generate consistent user avatars
}
