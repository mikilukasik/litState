import { component, html } from '../../../src';

export const Router = component(() => {
  return html`
    <div class="router">
      <h2>Router and Link Components with Navigate Method</h2>

      <p>
        This setup provides a simple client-side routing mechanism for
        single-page applications (SPAs). It uses a global state to keep track of
        the current route and updates the browser's URL without causing a page
        reload.
      </p>

      <h3>Navigate Method</h3>
      <p>
        The <code>navigate</code> function changes the current URL using
        <code>history.pushState</code> and updates the current route in the
        state.
      </p>

      <h3>Link Component</h3>
      <p>
        The <code>Link</code> component renders an anchor
        (<code>&lt;a&gt;</code>) tag that, when clicked, prevents the default
        browser navigation and instead calls the <code>navigate</code> function,
        thereby changing the route without a page refresh.
      </p>

      <h3>Router Component</h3>
      <p>
        The <code>Router</code> component takes a set of routes and renders the
        component corresponding to the current route. If no route matches, it
        falls back to a default ('*') route if provided.
      </p>

      <h3>Popstate Event Listener</h3>
      <p>
        An event listener for the <code>popstate</code> event is used to handle
        the browser's back and forward navigation, ensuring the displayed
        component matches the URL.
      </p>

      <h3>Example Usage</h3>
      <pre>
        <code class="language-javascript">

import { Router, Link, navigate } from 'litstate/components';
import { Home } from './Home';
import { About } from './About';
import { NotFound } from './NotFound';

// Usage of Link component
const NavBar = () => {
  return html\`
    &lt;div>
      \${Link({ to: '/', children: 'Home' })}
      \${Link({ to: '/about', children: 'About' })}
    &lt;/div>
  \`;
};

// Setup routes for Router component
const routes = {
  '/': Home,
  '/about': About,
  '*': NotFound,
};

// Usage of Router component
const App = () => {
  return html\`
    &lt;div>
      &lt;Router routes=\${routes} />
    &lt;/div>
  \`;
}

// Programmatic navigation
navigate('/about');
        </code>
      </pre>

      <p>
        The example code snippets show how the <code>Link</code> component is
        used to create navigable links, and how the
        <code>Router</code> component is set up with route-to-component
        mappings.
      </p>
    </div>
  `;
});
