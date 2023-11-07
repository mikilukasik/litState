import { component, html } from '../../../src';

export const StateManagement = component(
  () => html`
    <div class="state-management">
      <h2>State Management</h2>

      <p>
        State management plays a critical role in the consistent and efficient
        behavior of UI components within web applications. Employing a reactive
        state management pattern with recursively created proxies can
        significantly enhance this process.
      </p>

      <h3>Creating Global and Local States</h3>
      <p>
        Global state proxies are created using the
        <code>createState</code> method as outlined in the getting started
        guide. Invoking the same method within a component initializes a local
        state that is unique to it. This state is first set when the component
        mounts, and on every rerender, the initially created local state is
        consistently returned.
      </p>

      <h3>Automatic Component Rerenders</h3>
      <p>
        When interacting with state proxies, components do not require explicit
        listeners for state changes. Internally, the
        <code>addListener</code> method is utilized to automatically manage
        rerenders of the component whenever its state properties are updated.
      </p>

      <h3>Batch Updates</h3>
      <p>
        Batch updates are a performance optimization technique that consolidates
        state changes to prevent unnecessary rerenders. By wrapping state
        changes within the <code>batchUpdate</code> method, all updates are
        grouped and executed simultaneously, deferring rerenders until the
        entire batch operation is complete.
      </p>

      <h3>Listeners for Custom Logic</h3>
      <p>
        To implement custom logic in response to state changes outside of
        component lifecycles, you can use the <code>addListener</code> and
        <code>removeListener</code> methods. These listeners execute once upon
        creation, monitoring the accessed state properties, and are reinvoked
        whenever those properties undergo changes. These listeners do not always
        require a unique identifier. However, assigning a unique ID is necessary
        when you intend to remove them later or if they are within loops to
        prevent duplicates.
      </p>

      <h3>Deeply Nested Proxies</h3>
      <p>
        This state management pattern allows you to work with deeply nested
        objects and arrays within your state, all treated as proxies. As a
        result, components that depend on specific state properties will
        rerender only when those particular properties are updated, ensuring
        efficient and targeted updates.
      </p>

      <h3>Code Example and Usage</h3>
      <p>
        Below is a code example that showcases the implementation of state
        management with proxies, including the use of batch updates and listener
        methods for external state changes.
      </p>

      Initialize state management:
      <pre>
        <code class="language-typescript">
import { createState } from 'litstate-app';

export const appState = createState({
  user: null,
  theme: 'light',
  isLoggedIn: false
});
        </code>
      </pre>

      Listen to state changes in your components:
      <pre>
        <code class="language-typescript">
import { component, html, handler } from 'litstate-app';
import { appState } from './appState';

export const UserInfo = component(() => {
  return html\`
    &lt;div>
      User: \${appState.user ? appState.user.name : 'Guest'}
    &lt;/div>
  \`;
});

export const ThemeSwitcher = component(() => {
  const toggleTheme = handler(() => {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
  });

  return html\`
    &lt;button onclick="\${toggleTheme}">
      Switch to \${appState.theme === 'light' ? 'dark' : 'light'} theme
    &lt;/button>
  \`;
});
        </code>
      </pre>

      Update the global state from anywhere in your code:
      <pre>
        <code class="language-typescript">
import { appState } from './appState';

const login = (username) => {
  // Simulate a login
  appState.user = { name: username };
  appState.isLoggedIn = true;
};
        </code>
      </pre>

      You can also listen to state changes from outside of components. These
      listeners are triggered once upon being added, subscribing to the keys
      they reference. They will be executed again whenever any of the subscribed
      keys are modified. When creating listeners within loops, ensure to provide
      a unique id for each listener to maintain the correct tracking.
      <pre>
        <code class="language-typescript">
import { addListener, removeListener } from 'litstate-app';
import { appState } from './appState';

addListener(appState, () => {
  const { user } = appState;
  if (user) {
    console.log('User logged in:', user.name);
  }
}, 'userLoginListener'); // The ID is optional unless you need to remove the listener later, or it is within a loop

// Later, remove the listener
removeListener('userLoginListener');
        </code>
      </pre>

      Components can also have their own local state:
      <pre>
        <code class="language-typescript">
import { component, html, handler } from 'litstate-app';

export const Counter = component(() => {
  const state = createState({ count: 0 });

  const increment = handler(() => {
    state.count++;
  }

  return html\`
    &lt;div>
      Count: \${state.count}
      &lt;button onclick="\${increment}">Increment&lt;/button>
    &lt;/div>
  \`;
});
        </code>
      </pre>

      Perform batch updates to prevent unnecessary rerenders:
      <pre>
        <code class="language-typescript">
import { batchUpdate, appState } from './appState';

// Example of a batch update to change multiple state properties
batchUpdate(() => {
    appState.user = { name: 'Alice' };
    appState.isLoggedIn = true;
    appState.theme = 'dark';
});

// This ensures that all changes are made in a single go,
// reducing the number of renders triggered.
        </code>
      </pre>
    </div>
  `
);
