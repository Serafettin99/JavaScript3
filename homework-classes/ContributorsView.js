'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      this.container.textContent = '';
      contributors.forEach((contributor, index) => {
        const li = createAndAppend('li', this.container);
        if (index === 0) {
          createAndAppend('p', li, { text: 'Contributions' });
        }
        const div = createAndAppend('div', li);
        const div2 = createAndAppend('div', div);
        const img = createAndAppend('img', div2, {
          src: contributor['avatar_url'],
        });
        const a = createAndAppend('a', div2, {
          text: contributor['login'],
          href: contributor['html_url'],
        });
        const span = createAndAppend('span', div, {
          text: contributor['contributions'],
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
