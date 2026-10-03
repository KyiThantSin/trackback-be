export interface NotificationResponse {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  relatedPostId: string | null;
}

export interface NotificationsListResponse {
  items: NotificationResponse[];
  page: number;
  limit: number;
  total: number;
}