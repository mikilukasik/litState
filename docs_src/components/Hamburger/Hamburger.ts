import { component, handler, html } from '../../../src';
import { leftBarState } from '../LeftBar/LeftBar';

export const Hamburger = component(
  () =>
    html`
      <div
        class="hamburger"
        onclick="${handler(() => (leftBarState.isOpen = !leftBarState.isOpen))}"
      >
        ☰
      </div>
    `
);
