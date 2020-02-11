export interface iStrings {
  AboutUs_Intro: string;
  AboutUs_StoriesCTA: string;
  AddAccomplishment_Note: string;
  AddAccomplishment_Info: string;
  AddAccomplishment_SectionHeading_Student: string;
  AddAccomplishment_Label_UID: string;
  AddAccomplishment_Label_Fullname: string;
  AddAccomplishment_SectionHeading_HeroImage: string;
  AddAccomplishment_Info_HeroImage: string;
  AddAccomplishment_DropUploader_Label: string;
  AddAccomplishment_SectionHeading_AccomplishmentTitle: string;
  AddAccomplishment_SectionHeading_Excerpt: string;
  AddAccomplishment_Info_Excerpt: string;
  AddAccomplishment_SectionHeading_FullDetails: string;
  AddAccomplishment_Info_FullDetails: string;
  AuthError_UserTypeMismatch: string;
  AuthError_UserAlreadyExists: string;
  AuthError_Generic: string;
  AuthSuccess_AccountCreated: string;
  ConfirmEmail_ConfirmingEmail: string;
  ConfirmEmail_ConfirmationSuccess: string;
  ConfirmEmail_Continue: string;
  ResetPassword_ProvideEmail: string;
  ResetPassword_EmailSent: string;
}

export type ValidString = keyof iStrings;

export const getValidString = (key: ValidString) => key;

// tslint:disable: max-line-length
const Strings: iStrings = {
  AboutUs_Intro: 'The people behind\n Passport to College',
  AboutUs_StoriesCTA: 'more\n about us',
  AddAccomplishment_Note: 'Note:',
  AddAccomplishment_Info: 'A student accomplishment is a special type of post. It will always be available for reading in the blog and will appear on the student\'s profile page. Unlike student features, accomplishments do not have expirations.',
  AddAccomplishment_SectionHeading_Student: 'Student',
  AddAccomplishment_Label_UID: 'UID',
  AddAccomplishment_Label_Fullname: 'Full name',
  AddAccomplishment_SectionHeading_HeroImage: 'Hero Image',
  AddAccomplishment_Info_HeroImage: 'This is an optional hero image for the accomplishment. It will appear after the accomplishment title when a user opens the accomplishment.',
  AddAccomplishment_DropUploader_Label: 'Choose a hero image\n or drag it here',
  AddAccomplishment_SectionHeading_AccomplishmentTitle: 'Accomplishment Title',
  AddAccomplishment_SectionHeading_Excerpt: 'Excerpt',
  AddAccomplishment_Info_Excerpt: 'Provide an excerpt of the accomplishment\'s full details. It is usually the first paragraph of the full details, or the first couple sentences. This is what readers will see as a preview on the Stories page. Try to keep your excerpt under 100 words.',
  AddAccomplishment_SectionHeading_FullDetails: 'Full Details',
  AddAccomplishment_Info_FullDetails: 'Provide the full details about this student\'s accomplishment. This is what readers will see when the open the accomplishment.',
  AuthError_UserTypeMismatch: 'The account you used to sign in is not an applicant account. You must use an applicant account to access the application portal.',
  AuthError_UserAlreadyExists: 'A user was found linked to the account you provided. Try signing in instead.',
  AuthError_Generic: 'There was a problem with authorization. Please retry.',
  AuthSuccess_AccountCreated: 'Account created! You may now sign in using the continue application form.',
  ConfirmEmail_ConfirmingEmail: 'Confirming email address.',
  ConfirmEmail_ConfirmationSuccess: 'Way to go! Your email address has been confirmed.',
  ConfirmEmail_Continue: 'Continue Your Application',
  ResetPassword_ProvideEmail: 'Provide your email to reset your password',
  ResetPassword_EmailSent: 'Reset email sent to {0}. Check your email.',
};

export const Format = (validString: ValidString, args: string[]): string => {
  const regex: RegExp = /{[0=9]}/;
  let stringToBeFormatted = Strings[validString];
  let i = 0;

  while (stringToBeFormatted.match(regex)) {
    stringToBeFormatted = stringToBeFormatted.replace(regex, args[i]);
    i++;
  }

  return stringToBeFormatted;
};

export default Strings;