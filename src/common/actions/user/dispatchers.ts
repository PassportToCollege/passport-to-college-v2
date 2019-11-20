// Dispatches actions for the currently logged in user

import { Dispatch } from 'react';
import { Action } from '..';
import { db, auth } from '../../utils/firebase';
import { isEmail } from '../../utils/index';