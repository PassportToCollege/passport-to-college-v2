export enum NotificationType {
  Unknown = 'Unknown',
  Hero = 'Hero',
  Title = 'Title',
  Excerpt = 'Excerpt'
}

export default interface iNotification {
  type: NotificationType;
  isClosed: boolean;
  message: string;
}