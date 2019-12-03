import User from '../models/User';
import Cookies from 'universal-cookie';

export default interface iSSID {
  User: User;
  cookies: Cookies;
}