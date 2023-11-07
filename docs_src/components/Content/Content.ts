import { component, html } from '../../../src';
import { ContentCard } from '../ContentCard/ContentCard';
import { Home } from '../Home/Home';
import { GettingStarted } from '../GettingStarted/GettingStarted';
import { Component } from '../Component/Component';
import { StateManagement } from '../StateManagement/StateManagement';
import { Html } from '../Html/Html';
import { Handler } from '../Handler/Handler';
import { Mount } from '../Mount/Mount';
import { Router } from '../Router/Router';

export const Content = component(
  () =>
    html`
      <div class="content">
        ${ContentCard({ sectionName: 'home', children: Home() })}
        ${ContentCard({
          sectionName: 'getting-started',
          children: GettingStarted(),
        })}
        ${ContentCard({ sectionName: 'component', children: Component() })}
        ${ContentCard({
          sectionName: 'state-management',
          children: StateManagement(),
        })}
        ${ContentCard({ sectionName: 'html', children: Html() })}
        ${ContentCard({ sectionName: 'handler', children: Handler() })}
        ${ContentCard({ sectionName: 'mount', children: Mount() })}
        ${ContentCard({ sectionName: 'router', children: Router() })}
      </div>
    `
);
