import { component, html } from '../../../src';

export const Handler = component(() => {
  return html`
    <div class="handler">
      <h2>Handler Function</h2>

      <p>
        The <code>handler</code> function helps in defining and attaching event
        handlers within component templates. It accepts a function that will
        handle the event and an optional identifier for the handler.
      </p>

      <h3>Functionality</h3>
      <p>
        The <code>handler</code> function assigns the provided event handling
        function to a unique identifier within the component's context. This
        association ensures that the handler is correctly invoked when the
        corresponding event is triggered on the element.
      </p>

      <h3>Event Binding</h3>
      <p>
        It returns a string that binds the event handler to the component's
        instance. This string is used within the HTML markup to assign the
        handler to an event, such as
        <code>onclick</code>.
      </p>

      <h3>Example Usage</h3>
      <pre>
        <code class="language-javascript">
export const IncrementButton = component(() => {
  const incrementHandler = handler((event, element) => {
    console.log('Event:', event);
    console.log('Element:', element);
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

      <p>
        In the example above, the <code>handler</code> creates an event handler
        that logs the event object and the element that triggered the event
        before incrementing the state count.
      </p>

      <h3>Advantages</h3>
      <p>
        This structure allows for better code separation and readability. The
        event handler logic is maintained outside of the HTML string, thus
        making the templates cleaner and the code more maintainable.
      </p>
    </div>
  `;
});
