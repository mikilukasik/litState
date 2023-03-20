import { createState, component, html, handler } from '..';
import { Component } from '../types';

// Create a state object to store the current route
const state = createState({
  currentRoute: '/',
});

export const navigate = (to: string) => {
  history.pushState(null, '', to);
  state.currentRoute = to;
};

// Link component
export const Link = component(
  ({ to, children }) => html`
    <a
      href="${to}"
      onclick="${handler(e => {
        e.preventDefault();
        navigate(to as string);
      })}"
    >
      ${children}
    </a>
  `
);

// Router component
export const Router = component(({ routerId, routes = {} }) => {
  const RouteComponent = routes[state.currentRoute] || routes['*'];
  return RouteComponent(`${routerId}/${state.currentRoute}`);
});

// Set up an event listener for the browser's popstate event
window.addEventListener('popstate', () => {
  state.currentRoute = window.location.pathname;
});
