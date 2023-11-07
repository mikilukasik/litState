import { component, html } from '../../../src';

export const Home = component(
  () => html`
    <div class="home">
      <h2>litState</h2>
      <p>
        litState is a lean TypeScript framework for fast web app creation. Its
        highlights:
      </p>
      <ul>
        <li>Zero dependencies</li>
        <li>Simple, easy-to-learn API</li>
        <li>Reactive components with precise updates</li>
        <li>Effortless state management with proxies</li>
      </ul>
      <p>
        Ideal for small projects, it allows for quick setup and simple global
        state with automatic component updates.
      </p>
      <p>
        This website is built with litState. Check out the source code
        <a target="_blank" href="https://github.com/mikilukasik/litstate"
          >here</a
        >.
      </p>
    </div>
  `
);
