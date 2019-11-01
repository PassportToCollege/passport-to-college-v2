import { Menu, Hamburger } from '../actionTypes';
import { MenuState, HamburgerState } from '../../imodels/iAppState';
import { ActionCreator } from '..';

export const makeDashboardMenuFull = () =>
  ActionCreator<Menu, MenuState>(Menu.Full, { state: 'full' });

export const makeDashboardMenuCompact = () =>
  ActionCreator<Menu, MenuState>(Menu.Compact, { state: 'compact' });

export const closeDashboardMenu = () =>
  ActionCreator<Menu, MenuState>(Menu.Closed, { state: 'closed' });

export const openHamburgerMenu = () =>
  ActionCreator<Hamburger, HamburgerState>(Hamburger.Open, { state: 'open' });

export const closeHamburgerMenu = () =>
  ActionCreator<Hamburger, HamburgerState>(Hamburger.Close, { state: 'closed' });