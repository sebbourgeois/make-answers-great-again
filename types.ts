
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface TrumpResponse {
  text: string;
  isStreaming: boolean;
}
