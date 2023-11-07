import { component, html } from '../../../src';

export const Html = component(() => {
  return html`
    <div class="html-explanation">
      <h2>HTML Function</h2>

      <p>
        The <code>html</code> function is a tagged template literal function
        designed for creating HTML strings. It processes template literals,
        which are enclosed in backticks, and can contain placeholders for
        dynamic content.
      </p>

      <h3>How It Works</h3>
      <p>
        A template literal has two types of values: raw strings and values to be
        interpolated. The
        <code>html</code> function receives an array of strings and a list of
        values to be interpolated into those strings. It then concatenates them
        in order, forming a single HTML string.
      </p>

      <h3>Advantages of Using <code>html</code></h3>
      <p>
        This approach allows developers to write HTML in a familiar syntax
        within JavaScript files while providing the convenience of inserting
        dynamic content. Additionally, it aids in IDE syntax highlighting and
        format checking, improving the development experience.
      </p>

      <h3>Example of <code>html</code> Function</h3>
      <pre>
        <code class="language-javascript">
export const Greeting = component(({ name }) => {
  return html\`
    &lt;div>Hello, \${name}!&lt;/div>
  \`;
});
        </code>
      </pre>

      <h3>Dynamic Content Interpolation</h3>
      <p>
        The placeholders in the template literal are filled with the values
        provided, allowing dynamic content to be seamlessly integrated into the
        static HTML structure.
      </p>

      <h3>Usage in Components</h3>
      <p>
        Components return the result of the <code>html</code> function, which is
        an HTML string representing the component's template. This allows for
        the creation of complex UIs with dynamic data binding.
      </p>
    </div>
  `;
});
