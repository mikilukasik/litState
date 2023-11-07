import { component, createState, html } from '../../../src';

export const leftBarState = createState({
  isOpen: false,
});

export const LeftBar = component(
  () => html`
    <div
      id="left-bar-container"
      class="left-bar${leftBarState.isOpen ? ' active' : ''}"
    >
      <a href="#">Home</a>
      <a href="#getting-started">Getting Started</a>
      <a href="#component">Component</a>
      <a href="#state-management">State Management</a>
      <a href="#html">literal HTML</a>
      <a href="#handler">Handler</a>
      <a href="#mount">Mount</a>
      <a href="#router">Router</a>
    </div>
  `
);
