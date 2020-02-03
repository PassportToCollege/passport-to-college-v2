export enum NotificationType {
  Unknown = 'Unknown',
  HeroError = 'HeroError',
  HeroUploadError = 'HeroUploadError',
  TitleError = 'TitleError',
  ExcerptError = 'ExcerptError',
  AccomplishmentDetailsError = 'AccomplishmentDetailsError',
  AuthError = 'AuthError',
  AuthAccountCreationError = 'AuthAccountCreationError',
  AuthAccountCreated = 'AuthAccountCreated'
}

export default interface iNotification {
  type: NotificationType;
  isClosed: boolean;
  message: string;
}