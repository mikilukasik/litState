// import { createState, component, html, handler, mount } from '../src/index';

import { mount } from '../src';
import { App } from './components/App/App';

const containerId = 'app';

mount(App(), containerId);
