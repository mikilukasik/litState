import { component, html } from '../../../src';

export const GettingStarted = component(
  () => html`
    <div class="getting-started">
      <h2>Getting Started</h2>

      Install the package:
      <pre>
        <code class="language-bash">
npm install litstate
        </code>
      </pre>

      Create a global state object:
      <pre>
        <code class="language-typescript">
import { createState } from 'litstate';

const initialState = {
  count: 0,
};

export const globalState = createState(initialState);
        </code>
      </pre>

      Create multiple components that use the global state:
      <pre>
        <code class="language-typescript">
import { component, html, handler } from 'litstate';
import { globalState } from './globalState';

export const Counter = component(() => {
  return html\`
    &lt;div>
      &lt;p>Count: \${globalState.count}&lt;/p>
    &lt;/div>
  \`;
});

export const IncrementButton = component(() => {
  const incrementHandler = handler(() => {
    globalState.count++;
  });

  return html\`
    &lt;div>
      &lt;button onclick="\${incrementHandler}">Increment&lt;/button>
    &lt;/div>
  \`;
});
        </code>
      </pre>

      Create a root component that renders the other components:
      <pre>
        <code class="language-typescript">
import { component, html } from 'litstate';
import { Counter } from './Counter';
import { IncrementButton } from './IncrementButton';

export const App = component(() => {
  return html\`
    &lt;div>
      \${Counter()}
      \${IncrementButton()}
    &lt;/div>
  \`;
});
        </code>
      </pre>

      Create a container element for your app:
      <pre>
        <code class="language-html">
&lt;div id="app">&lt;/div>
        </code>
      </pre>

      Mount the root component to the container element:
      <pre>
        <code class="language-typescript">
import { mount } from 'litstate';
import { App } from './App';

mount(App, 'app');
        </code>
      </pre>

      <p>That's it! You can now increment the count by clicking the button.</p>
    </div>
  `
);
