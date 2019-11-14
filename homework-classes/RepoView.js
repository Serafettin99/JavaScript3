'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repo) {
      this.container.innerHTML = '';
      const li = createAndAppend('li', this.container);
      const table = createAndAppend('table', li);
      const headers = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
      const keys = ['name', 'description', 'forks', 'updated_at'];

      keys.forEach((key, index) => {
        let tr = createAndAppend('tr', table);
        createAndAppend('th', tr, { text: headers[index] });
        if (index === 0) {
          let td = createAndAppend('td', tr);
          createAndAppend('a', td, { href: repo.html_url, text: repo['name'] });
        } else {
          createAndAppend('td', tr, { text: repo[key] });
        }
      });
    }
  }

  window.RepoView = RepoView;
}
