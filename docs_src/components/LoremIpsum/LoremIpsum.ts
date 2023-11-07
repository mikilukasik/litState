import { component, html } from '../../../src';

export const LoremIpsum = component(
  () => html`
    <div class="lorem-ipsum">
      <h2>Lorem Ipsum</h2>

      <h3>Lorem Ipsum Dolor</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>

      <h4>Subsection A</h4>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <h4>Subsection B</h4>
      <p>
        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
        varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
        magna felis sollicitudin mauris.
      </p>

      <ul>
        <li>Integer in mauris eu nibh euismod gravida.</li>
        <li>Duis ac tellus et risus vulputate vehicula.</li>
        <li>Donec lobortis risus a elit. Etiam tempor.</li>
        <li>
          Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id
          tincidunt sapien risus a quam.
        </li>
        <li>Maecenas fermentum consequat mi. Donec fermentum.</li>
      </ul>

      <h3>Consectetur Adipiscing Elit</h3>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
        ultricies eget, tempor sit amet, ante.
      </p>

      <h4>Subsection C</h4>
      <p>
        Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue,
        eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi,
        tincidunt quis, accumsan porttitor, facilisis luctus, metus.
      </p>

      <h4>Subsection D</h4>
      <p>
        Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer
        ligula vulputate sem tristique cursus. Nam nulla quam, gravida non,
        commodo a, sodales sit amet, nisi.
      </p>

      <ul>
        <li>
          Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.
          Sed arcu.
        </li>
        <li>
          Curabitur convallis. Duis consequat quam. Morbi imperdiet, mauris ac
          auctor dictum.
        </li>
      </ul>
    </div>
  `
);
