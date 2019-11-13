'use strict';
// Fetch the Api
function fetchJSON(url) {
  return fetch(url).then(response => {
    if (response.ok) {
      // `response.ok` contains a boolean stating whether the response was successful (status in the range 200-299) or not.
      return response.json();
    } else {
      throw new Error('An error occurred!');
    }
  });
}

// Create elements and appends it to the HTML
function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'text') {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

//Render one of the repository in HTML
function renderRepoDetails(repo, repoUlElement) {
  const li = createAndAppend('li', repoUlElement);
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

//render the data of contributors
function renderContributors(url, elem) {
  fetchJSON(url)
    .then(contributors => {
      contributors.forEach((contributor, index) => {
        const li = createAndAppend('li', elem);
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
    })
    .catch(err => {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    });
}

function main(url) {
  const root = document.getElementById('root');
  const header = createAndAppend('header', root);
  const p = createAndAppend('p', header, {
    text: 'HYF Repositories',
  });
  const select = createAndAppend('select', header);
  const main = createAndAppend('main', root, {
    class: 'main-container',
  });
  const repoSection = createAndAppend('section', main, {
    class: 'repo-container',
  });
  const contributorsSection = createAndAppend('section', main, {
    class: 'contributors-container',
  });
  fetchJSON(url)
    .then(
      // display the first ul, header, select and options elements in ascending order.
      repositories => {
        const repoUlElement = createAndAppend('ul', repoSection);
        repositories
          .sort((currentRepo, nextRepo) =>
            currentRepo.name.localeCompare(nextRepo.name),
          )
          .forEach((repo, index) => {
            const option = createAndAppend('option', select, {
              text: repo.name,
              value: index,
            });
          });

        const contributorsUlElementwe = createAndAppend(
          'ul',
          contributorsSection,
        );
        select.addEventListener('change', () => {
          // Made it empty in order not to mass all the repositories and contributors section one after another.
          repoUlElement.textContent = '';
          contributorsUlElement.textContent = '';
          renderRepoDetails(repositories[select.value], repoUlElement); //display the repository while the selected repository is changed
          renderContributors(
            repositories[select.value].contributors_url,
            contributorsUlElement,
          ); //display the contributors of the selected repository
        });
        //Render the first selected repository and its contributors section
        renderRepoDetails(repositories[select.value], repoUlElement);
        renderContributors(
          repositories[select.value].contributors_url,
          contributorsUlElement,
        );
      },
    )
    .catch(err => {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
    });
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page100';
window.onload = () => main(HYF_REPOS_URL);
