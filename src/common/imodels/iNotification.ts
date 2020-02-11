export enum NotificationType {
  Unknown = 'Unknown',
  HeroError = 'HeroError',
  HeroUploadError = 'HeroUploadError',
  TitleError = 'TitleError',
  ExcerptError = 'ExcerptError',
  AccomplishmentDetailsError = 'AccomplishmentDetailsError',
  AuthError = 'AuthError',
  AuthAccountCreationError = 'AuthAccountCreationError',
  AuthAccountCreated = 'AuthAccountCreated',
  AuthConfirmationEmailError = 'AuthConfirmationEmailError',
  AuthConfirmationEmailSent = 'AuthConfirmationEmailSent'
}

export default interface iNotification {
  type: NotificationType;
  isError: boolean;
  isClosed: boolean;
  message: string;
}