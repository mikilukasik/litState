import { component, html } from '../../../src';

export const Mount = component(() => {
  return html`
    <div class="mount">
      <h2>Mount Method</h2>

      <p>
        The <code>mount</code> method is responsible for rendering a component
        into a specified DOM container. It connects the component's rendering
        output to the actual web page.
      </p>

      <h3>Usage</h3>
      <p>
        To use <code>mount</code>, you must first define a container element in
        your HTML, such as a <code>div</code> with an identifier. Then, you call
        <code>mount</code> with your root component and the identifier of the
        container element as arguments.
      </p>

      <h3>Example</h3>
      <pre>
        <code class="language-javascript">
// Define your container element in HTML
&lt;div id="app">&lt;/div>

// Import the mount function and your root component
import { mount } from 'litstate';
import { App } from './App';

// Mount the root component into the container
mount(App, 'app');
        </code>
      </pre>

      <p>
        The example above demonstrates how <code>mount</code> takes the
        <code>App</code> component and renders it within the element with the
        <code>id</code> of "app".
      </p>

      <h3>Single Root</h3>
      <p>
        Typically, an application will have a single root component that
        contains all other components, and you use <code>mount</code> to render
        this root component.
      </p>

      <h3>Initialization</h3>
      <p>
        The <code>mount</code> function is usually called once, when
        initializing the application, to kick off the rendering process and
        display the initial UI.
      </p>
    </div>
  `;
});
