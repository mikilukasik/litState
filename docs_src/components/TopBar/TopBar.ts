import { component, html } from '../../../src';
import { Hamburger } from '../Hamburger/Hamburger';
import { Title } from '../Title/Title';

export const TopBar = component(
  () => html` <div class="top-bar">${Hamburger()} ${Title()}</div> `
);
