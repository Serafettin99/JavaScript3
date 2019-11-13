'use strict';
// Fetch the Api
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      // `response.ok` contains a boolean stating whether the response was successful (status in the range 200-299) or not.
      return response.json();
    } else {
      throw new Error('An error occurred!');
    }
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
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
function renderRepoDetails(repo, ul) {
  const li = createAndAppend('li', ul);
  const table = createAndAppend('table', li);
  const headers = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
  const keys = ['name', 'description', 'forks', 'updated_at'];

  keys.forEach((key, index) => {
    let tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: headers[index] });
    console.log({ text: headers[index] });
    if (index === 0) {
      let td = createAndAppend('td', tr);
      createAndAppend('a', td, { href: repo.html_url, text: repo['name'] });
    } else {
      createAndAppend('td', tr, { text: repo[key] });
    }
  });
}

async function renderContributors(url, elem) {
  try {
    const contributors = await fetchJSON(url);
    contributors.forEach(contributor => {
      const li = createAndAppend('li', elem);
      const div = createAndAppend('div', li);

      const img = createAndAppend('img', div, {
        src: contributor['avatar_url'],
      });
      const a = createAndAppend('a', div, {
        text: contributor['login'],
        href: contributor['url'],
      });
      const span = createAndAppend('span', li, {
        text: contributor['contributions'],
      });
    });
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
}

async function main(url) {
  const root = document.getElementById('root');
  const header = createAndAppend('header', root, {
    text: 'HYF Repositories',
  });
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
  try {
    const repositories = await fetchJSON(url);
    const repoUlELement = createAndAppend('ul', repoSection);
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

    const contributorsUlElement = createAndAppend('ul', contributorsSection);
    select.addEventListener('change', event => {
      // Made it empty in order not to mass all the repositories and contributors section one after another.
      repoUlELement.textContent = '';
      contributorsUlElement.textContent = '';
      renderRepoDetails(repositories[select.value], repoUlELement); //display the repository while the selected repository is changed
      renderContributors(
        repositories[select.value].contributors_url,
        contributorsUlElement,
      ); //display the contributors of the selected repository
    });
    //Render the first selected repository and its contributors section
    renderRepoDetails(repositories[select.value], repoUlELement);
    renderContributors(
      repositories[select.value].contributors_url,
      contributorsUlElement,
    );
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
}

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page100';
window.onload = () => main(HYF_REPOS_URL);
