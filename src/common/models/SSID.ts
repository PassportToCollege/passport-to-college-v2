import Cookies from 'universal-cookie';

import iSSID from '../imodels/iSSID';
import User from './User';

export default class SSID implements iSSID {
  public User: User;
  public cookies: Cookies;

  constructor(user: User) {
    this.User = user;
    this.cookies = new Cookies();
  }

  public create() {
    this.cookies.set('ssid', this.User.data, {
      path: '/',
      maxAge: 60 * 60  * 24 * 3
    });
  }

  public destroy() {
    this.cookies.remove('ssid', {
      path: '/'
    });
  }
}