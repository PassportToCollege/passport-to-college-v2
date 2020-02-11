export enum NotificationType {
  Unknown = 'Unknown',
  HeroError = 'HeroError',
  HeroUploadError = 'HeroUploadError',
  TitleError = 'TitleError',
  ExcerptError = 'ExcerptError',
  AccomplishmentDetailsError = 'AccomplishmentDetailsError',
  AuthError = 'AuthError',
  AuthSuccess = 'AuthSuccess',
  AuthAccountCreationError = 'AuthAccountCreationError',
  AuthAccountCreated = 'AuthAccountCreated',
  UserErrorFailedToUpdate = 'UserErrorFailedToUpdate',
}

export default interface iNotification {
  type: NotificationType;
  isError: boolean;
  isClosed: boolean;
  message: string;
}