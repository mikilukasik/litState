import { component, html } from '../../../src';
import { Content } from '../Content/Content';
import { LeftBar } from '../LeftBar/LeftBar';
import { TopBar } from '../TopBar/TopBar';

export const App = component(
  () => html` <div class="app">${TopBar()} ${LeftBar()} ${Content()}</div> `
);
