import { createState, component, html, handler } from '..';

// Create a state object to store the current route
const state = createState({
  currentRoute: '/',
});

// Link component
export const Link = component(
  ({ to, children }) => html`
    <a
      href="${to}"
      onclick="${handler(e => {
        e.preventDefault();
        history.pushState(null, '', to);
        state.currentRoute = to;
      })}"
    >
      ${children}
    </a>
  `
);

// Router component
export const Router = component(({ routes }) => {
  const RouteComponent = routes[state.currentRoute] || routes['*'];
  return RouteComponent();
});

// Set up an event listener for the browser's popstate event
window.addEventListener('popstate', () => {
  state.currentRoute = window.location.pathname;
});
