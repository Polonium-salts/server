export type RelationStatus = 'pending' | 'accepted' | 'blocked';

export interface UserRelation {
  id: number;
  user_id: number;
  related_user_id: number;
  status: RelationStatus;
  created_at: Date;
  updated_at: Date;
}

export interface UserRelationCreationParams {
  user_id: number;
  related_user_id: number;
  status: RelationStatus;
}