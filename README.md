# LitState

LitState is a small and convenient frontend framework for building reactive web applications. It consists of a single file for the framework core and another file for components (Router and Link). LitState utilizes a recursive proxy-based state management system and reactive rendering to make developing web applications a breeze.

## Features

- Easy state management with reactive rendering
- Router and Link components for seamless navigation
- Minimalistic and lightweight
- Highly customizable

## Getting Started

1. Include `index.ts` and `Router.ts` in your project.
2. Import the necessary components and functions from LitState:

   ```javascript
   import { createState, component, html, handler, mount } from './index';
   import { Router, Link } from './Router';
   ```

## Usage

### Creating a State

Create a new state using the `createState` function:

```javascript
export const globalState = createState({
  counter: 0,
});
```

### Creating a Component

Create a new component using the component function:

```javascript
import { state } from './state';

const Counter = component(
  ({ label }) => html`
    <div>
      <h1>${label} ${globalState.count}</h1>
    </div>
  `
);
```

### Mounting a Component

Mount a component into an HTML container:

```javascript
const container = document.getElementById('app');
mount(Counter({ label: 'Counter: ' }), container);
```

### Updating State

Modify the state to trigger a reactive render:

```javascript
state.counter = 1;
```

### Router and Link Components

Use the Router and Link components for navigation:

```javascript
const Home = () => html`
  <div>
    <h1>Home</h1>
    ${Link({ to: '/about', children: 'Go to About' })}
  </div>
`;

const About = () => html`
  <div>
    <h1>About</h1>
    ${Link({ to: '/', children: 'Go to Home' })}
  </div>
`;

const Header = ({ title }) => html`
  <div>
    <h1>${title}</h1>
  </div>
`;

const App = () => html`
  <div>${Header({ title: 'Hello world!' })}</div>
  <div>
    ${Router({
      routes: {
        '/': Home,
        '/about': About,
        '*': () => html`<h1>404 Not Found</h1>`,
      },
    })}
  </div>
`;

mount(App(), container);
```

### License

This project is open-source and available under the MIT License.
