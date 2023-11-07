import { component, html } from '../../../src';

export const ContentCard = component(
  ({ children, sectionName }) =>
    html` <div id="${sectionName}" class="content-card">${children}</div> `
);
