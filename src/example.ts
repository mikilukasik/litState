// import { App, html } from '../src/index';

// const app = new App();
// const { component } = app;

// app.store.counter = 0;
// app.store.counter2 = 0;
// app.store.nest = {};

// setInterval(() => (app.store.counter += 1), 1000);
// setInterval(() => (app.store.counter2 += 1), 1600);
// setInterval(() => (app.store.nest.val = Math.random()), 1300);
// setInterval(() => (app.store.nest.val2 = Math.random()), 1850);

// // const Title = component(props => {
//   return html`
//     <h1>Hello World, this is nanoFlow.</h1>
//     <sub>${store.nest.val}</sub>
//   `;
// });

// // const Description = component(props => {
//   return html`<p>I'm a tiny framework.</p>
//     <div>Counter: ${store.counter}</div>`;
// });

// // const AnotherCounter = component(props => {
//   return `${props.prefix} plain string Counter: ${store.counter2}`;
// });

// // const DounbleCounter = component(props => {
//   return html`<div>Combined Counter: ${store.counter} ${store.counter2}</div>`;
// });

// // const UsingNested = component(props => {
//   return html`<div>Nested: ${store.nest.val}</div>`;
// });

// // const UsingNested2 = component(props => {
//   return html`<div>Nested2: ${store.nest.val2}</div>`;
// });

// const Root = component(() => {
//   return html`<div>
//     ${Title()} ${Description()} ${AnotherCounter({ prefix: 'first' })},
//     ${AnotherCounter({ prefix: 'second' })}
//     <div style="background-color:lightblue;">${DounbleCounter()}</div>
//     <div style="background-color:lightgreen;">${UsingNested()}</div>
//     <div style="background-color:silver;">${UsingNested2()}</div>
//   </div>`;
// });

// const container = document.getElementById('app-container');
// if (container) app.mount(Root, container);
