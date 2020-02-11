import { Format } from '../strings';

test('[Format] correctly replaces placeholder with email', () => {
  const validString = 'ResetPassword_EmailSent';
  const email = 'example@www.com';

  const result = Format(validString, [email]);
  expect(result.indexOf(email)).toBeGreaterThan(0);
});