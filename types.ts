
export interface EmotionChangeEntry {
  id: string;
  timestamp: string;
  description?: string;
}

export interface DailyExercise {
  id: string; // YYYY-MM-DD
  date: string;
  emotionChanges: EmotionChangeEntry[];
  goodEvents: string[];
  morningGratitude: {
    affirmedYesterdayChanges: boolean;
    reviewedYesterdayEvents: string[]; // From previous day's goodEvents
    newGratitudes: string[];
  };
  moodAtStart?: string; // e.g., 'happy', 'neutral', 'sad'
  completed: boolean;
  aiFeedback?: string;
}

export interface UserProfile {
  name: string;
  vibeId?: string;
  joinDate: string;
}

export interface AppSettings {
  enableNotifications: boolean;
  reminderTime: string; // HH:mm
  theme: 'dark' | 'light'; // Example, though current design is dark
}

export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievalQuery?: string;
  text?: string;
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
