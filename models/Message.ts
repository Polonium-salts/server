export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
}

export interface MessageCreationParams {
  sender_id: number;
  receiver_id: number;
  content: string;
}