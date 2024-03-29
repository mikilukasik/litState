import { component, html } from '../../../src';

export const Component = component(() => {
  return html`
    <div class="component">
      <h2>Component Function</h2>

      <p>
        The <code>component</code> function is used to define a reusable UI
        component. It takes a function that returns a template literal as an
        argument. This function can optionally receive an object of props, which
        are passed when the component is invoked.
      </p>

      <h3>Props and Composition</h3>
      <p>
        Props are objects passed into the component function that allow data to
        flow from the parent component down to the child components. They are
        accessible within the component as the first argument to the function.
      </p>

      <h3>Defining a Component</h3>
      <pre>
        <code class="language-javascript">
export const MyComponent = component(({ title, content }) => {
  return html\`
    &lt;div>
      &lt;h1>\${title}&lt;/h1>
      &lt;p>\${content}&lt;/p>
    &lt;/div>
  \`;
});
        </code>
      </pre>

      <h3>Rendering a Component with Props</h3>
      <pre>
        <code class="language-javascript">
// Somewhere in the parent component
const title = 'Hello World';
const content = 'This is a simple component.';

html\`
  \${MyComponent({ title, content })}
\`;
        </code>
      </pre>

      <h3>Usage of Component ID</h3>
      <p>
        The component's unique identifier, <code>id</code>, can be included in
        the props object. If not provided, the <code>id</code> is automatically
        generated based on the component's position in the call stack and is
        appended to the props object, facilitating straightforward access within
        the component function.
      </p>
      <p>
        When instantiating multiple instances of a component within a loop, it's
        crucial to assign a distinct <code>id</code> prop to each. This
        <code>id</code> is critical because, without it, components rendered in
        a loop could share identical stack traces, potentially causing rendering
        conflicts.
      </p>

      <pre>
        <code class="language-javascript">
import { component, html } from '../../../src';

export const LoopComponent = component(props => {
  const { id } = props; // Destructure the id from props if needed

  return html\`
    &lt;div>
      &lt;!-- some HTML -->
    &lt;/div>
  \`;
});

// Use the component in a loop with unique 'id' props
html\`
  \${yourArray.map((item, index) =>
    LoopComponent({ ...item, id: item.uniqueId || index })
  )}
\`;
</code>
</pre>
    </div>
  `;
});
