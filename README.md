# litState

## Overview

**litState** is a lightweight TypeScript framework for creating web applications quickly and efficiently. It provides:

- **Zero dependencies**: Streamlines your project setup.
- **Simple API**: Easy to learn and use.
- **Reactive Components**: Optimize your UI with precise updates.
- **State Management**: Utilize proxies for effortless state handling.
- **Fast Project Setup**: Ideal for small projects with its quick setup.

Check out the [full documentation](https://mikilukasik.github.io/litState/) or for more details.

## Installation

To get started, install litState using npm:

`npm install litstate-app`

## Usage

### Setting Up Global State

Import and create a global state object:

```javascript
import { createState } from 'litstate-app';

const initialState = {
  count: 0,
};

export const globalState = createState(initialState);
```

### Creating Components

Build components that interact with the global state:

```javascript
import { component, html, handler } from 'litstate-app';
import { globalState } from './globalState';

export const Counter = component(() => {
  return html`
    <div>
      <p>Count: ${globalState.count}</p>
    </div>
  `;
});

export const IncrementButton = component(() => {
  const incrementHandler = handler(() => {
    globalState.count++;
  });

  return html`
    <div>
      <button onclick="${incrementHandler}">Increment</button>
    </div>
  `;
});
```

### Root Component

Create a root component to render other components:

```javascript
import { component, html } from 'litstate-app';
import { Counter, IncrementButton } from './components';

export const App = component(() => {
  return html` <div>${Counter()} ${IncrementButton()}</div> `;
});
```

### Mounting the App

Mount the root component to the DOM:

```javascript
import { mount } from 'litstate-app';
import { App } from './App';

// HTML element where the app will mount
// <div id="app"></div>;

// Mount the App component to the 'app' element
mount(App, 'app');
```

### Component Function

Define a reusable UI component:

```javascript
export const MyComponent = component(({ title, content }) => {
  return html`
    <div>
      <h1>${title}</h1>
      <p>${content}</p>
    </div>
  `;
});
```

Instantiate the component with the desired props:

```javascript
import { MyComponent } from './MyComponent';

export const App = component(() => {
  return html`
    <div>${MyComponent({ title: 'My Title', content: 'My Content' })}</div>
  `;
});
```

The component's unique identifier, id, can be included in the props object. If not provided, the id is automatically generated based on the component's position in the call stack and is appended to the props. When defining components that may be instantiated multiple times within a loop, it's important to provide an id prop to ensure each instance maintains a unique identity:

```javascript
import { component, html } from '../../../src';

export const LoopComponent = component(props => {
  const { id } = props; // Destructure the id from props if needed

  return html`
    <div>
      <!-- some HTML -->
    </div>
  `;
});

// Use the component in a loop with unique 'id' props
html`
  ${yourArray.map((item, index) =>
    LoopComponent({ ...item, id: item.uniqueId || index })
  )}
`;
```

### State Management

litState provides a straightforward state management system designed to enable both global and local states, leveraging the power of JavaScript proxies for reactivity. These states are deeply reactive due to the recursive use of proxies, ensuring updates are precise and components re-render only when necessary.

```javascript
import {
  createState,
  addListener,
  removeListener,
  batchUpdate,
  html,
} from 'litstate-app';

// Create a global state object
export const appState = createState({
  user: {
    name: 'Jane Doe',
    age: 25,
  },
  theme: 'light',
  isLoggedIn: false,
});

// Create a component that uses the global and local states
export const MyComponent = component(() => {
  // Create a local state object
  const localState = createState({
    count: 0,
  });

  const incrementHandler = handler(() => {
    // Update the local state
    localState.count++;
  });

  const userNameSetter = handler(() => {
    // Update the global state
    appState.user.name = 'John Doe';
  });

  return html`
    <div>
      <p>Global state: ${appState.user.name}</p>
      <p>Local state: ${localState.count}</p>
      <button onclick="${incrementHandler}">Increment</button>
      <button onclick="${userNameSetter}">Set User Name</button>
    </div>
  `;
});
```

State updates can be done from anywhere in your application, including outside of components:

```javascript
import { appState } from './appState';

// Update the global state
appState.user.name = 'John Doe';
```

### Batch State Updates

Batch state updates are useful to prevent unnecessary re-renders. Multiple state updates can be batched together using the `batchUpdate` function. Components will only re-render once all state updates are complete.

```javascript
import { appState } from './appState';
import { batchUpdate } from 'litstate-app';

// Batch state updates
batchUpdate(() => {
  appState.user.name = 'John Doe';
  appState.user.age = 30;
});
```

### Adding and Removing Listeners

To listen for state changes outside of components, use the `addListener` function. These listeners execute once upon creation, monitoring the accessed state properties, and are reinvoked whenever those properties undergo changes. When creating listeners within loops or multiple instances, ensure to provide a unique id for each listener to maintain the correct tracking and to provide the capability to remove them individually if needed.

```javascript
import { appState } from './appState';
import { addListener, removeListener } from 'litstate-app';

// Create a listener with an ID
addListener(() => {
  console.log('User name:', appState.user.name);
}, 'user-name-listener'); // The ID is optional unless you need to remove the listener later, or it is within a loop

// Later, remove the listener
removeListener('user-name-listener');
```

### HTML Function

Utilize the `html` function to create and manage dynamic HTML content:

```javascript
import { html } from 'litstate-app';

export const Greeting = component(({ name }) => {
  return html` <div>Hello, ${name}!</div> `;
});
```

### Handler Function

Handle events within your components:

```javascript
export const IncrementButton = component(() => {
  const incrementHandler = handler((event, element) => {
    console.log('Event:', event);
    console.log('Element:', element);
    globalState.count++;
  });

  return html`
    <div>
      <button onclick="${incrementHandler}">Increment</button>
    </div>
  `;
});
```

### Mount Method

Render your component into the DOM:

```javascript
// In your HTML file
// <div id="app"></div>

import { mount } from 'litstate-app';
import { App } from './App';

mount(App, 'app');
```

### Router and Link Components

Implement client-side routing:

```javascript
import { Router, Link, navigate } from 'litstate-app/components';
import { Home, About, NotFound } from './components';

const NavBar = () => {
  return html`
    <div>
      ${Link({ to: '/', children: 'Home' })} ${Link({
        to: '/about',
        children: 'About',
      })}
    </div>
  `;
};

const routes = {
  '/': Home,
  '/about': About,
  '*': NotFound,
};

const App = () => {
  return html`
    <div>
      <Router routes=${routes} />
    </div>
  `;
};

// Use navigate to change routes programmatically
navigate('/about');
```

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
