import { component, html } from '../../../src';

export const LeftBarLink = component(
  ({ to, children }) =>
    html` <a class="left-bar-link" href="${to || '#'}">${children}</a> `
);
