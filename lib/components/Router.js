"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.Link = exports.navigate = void 0;
const __1 = require("..");
// Create a state object to store the current route
const state = (0, __1.createState)({
    currentRoute: '/',
});
const navigate = (to) => {
    history.pushState(null, '', to);
    state.currentRoute = to;
};
exports.navigate = navigate;
// Link component
exports.Link = (0, __1.component)(({ to, children }) => (0, __1.html) `
    <a
      href="${to}"
      onclick="${(0, __1.handler)(e => {
    e.preventDefault();
    (0, exports.navigate)(to);
})}"
    >
      ${children}
    </a>
  `);
// Router component
exports.Router = (0, __1.component)(({ routes }) => {
    const RouteComponent = routes[state.currentRoute] || routes['*'];
    return RouteComponent();
});
// Set up an event listener for the browser's popstate event
window.addEventListener('popstate', () => {
    state.currentRoute = window.location.pathname;
});
