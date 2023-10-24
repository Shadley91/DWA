import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

/**
 * The application state.
 * @typedef {Object} State
 * @property {number} page - The current page number.
 * @property {Array} matches - The list of matched books.
 */

/** @type {State} */
const state = {
  page: 1,
  matches: books,
};

/**
 * Create a preview element for a book.
 *
 * @param {Object} book - The book object.
 * @param {string} book.author - The author's name.
 * @param {string} book.id - The book's unique identifier.
 * @param {string} book.image - The URL of the book's image.
 * @param {string} book.title - The book's title.
 * @returns {HTMLButtonElement} The button element representing the book preview.
 */

function createPreviewElement({ author, id, image, title }) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
    <img
        class="preview__image"
        src="${image}"
    />
    
    <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
}

/**
 * Create genre options for the search form.
 *
 * @returns {DocumentFragment} The document fragment containing genre options.
 */

function createGenreOptions() {
  const genreHtml = document.createDocumentFragment();
  const firstGenreElement = document.createElement("option");
  firstGenreElement.value = "any";
  firstGenreElement.innerText = "All Genres";
  genreHtml.appendChild(firstGenreElement);

  for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
  }

  return genreHtml;
}

/**
 * Create author options for the search form.
 *
 * @returns {DocumentFragment} The document fragment containing author options.
 */

function createAuthorOptions() {
  const authorsHtml = document.createDocumentFragment();
  const firstAuthorElement = document.createElement("option");
  firstAuthorElement.value = "any";
  firstAuthorElement.innerText = "All Authors";
  authorsHtml.appendChild(firstAuthorElement);

  for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    authorsHtml.appendChild(element);
  }

  return authorsHtml;
}

/**
 * Set the theme of the application.
 *
 * @param {string} theme - The theme ('night' or 'day').
 */

function setTheme(theme) {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
}

/**
 * Update the "Show more" button's text and state.
 */

function updateListButton() {
  const remaining = state.matches.length - state.page * BOOKS_PER_PAGE;
  document.querySelector("[data-list-button]").innerText = `Show more (${
    remaining > 0 ? remaining : 0
  })`;
  document.querySelector("[data-list-button]").disabled = remaining <= 0;
}

/**
 * Filter books based on search criteria.
 *
 * @param {FormData} formData - The form data from the search form.
 * @returns {Array} The filtered list of books.
 */

function filterBooks(formData) {
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  return result;
}

/**
 * Update the book list based on filtered results and show/hide the message.
 *
 * @param {Array} result - The filtered list of books.
 */

function updateList(result) {
  state.page = 1;
  state.matches = result;
  const listMessage = document.querySelector("[data-list-message]");
  const listItems = document.querySelector("[data-list-items]");

  if (result.length < 1) {
    listMessage.classList.add("list__message_show");
  } else {
    listMessage.classList.remove("list__message_show");
  }

  listItems.innerHTML = "";
  const newItems = document.createDocumentFragment();

  for (const book of result.slice(0, BOOKS_PER_PAGE)) {
    newItems.appendChild(createPreviewElement(book));
  }

  listItems.appendChild(newItems);
  updateListButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Show more books in the list.
 */

function showMore() {
  const fragment = document.createDocumentFragment();

  for (const book of state.matches.slice(
    state.page * BOOKS_PER_PAGE,
    (state.page + 1) * BOOKS_PER_PAGE
  )) {
    fragment.appendChild(createPreviewElement(book));
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  state.page += 1;
}

/**
 * Handle click events on book previews to display details.
 *
 * @param {Event} event - The click event.
 */

function handlePreviewClick(event) {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      for (const book of books) {
        if (book.id === node?.dataset?.preview) {
          active = book;
          break;
        }
      }
    }
  }

  if (active) {
    const listActive = document.querySelector("[data-list-active]");
    listActive.open = true;
    document.querySelector("[data-list-blur]").src = active.image;
    document.querySelector("[data-list-image]").src = active.image;
    document.querySelector("[data-list-title]").innerText = active.title;
    document.querySelector("[data-list-subtitle]").innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText =
      active.description;
  }
}

document
  .querySelector("[data-list-items]")
  .addEventListener("click", handlePreviewClick);

// Initialize the page
const starting = document.createDocumentFragment();
for (const book of state.matches.slice(0, BOOKS_PER_PAGE)) {
  starting.appendChild(createPreviewElement(book));
}

// Populate genre and author options
document.querySelector("[data-list-items]").appendChild(starting);
document
  .querySelector("[data-search-genres]")
  .appendChild(createGenreOptions());
document
  .querySelector("[data-search-authors]")
  .appendChild(createAuthorOptions());

// Check the user's preferred theme and set it
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.querySelector("[data-settings-theme]").value = "night";
  setTheme("night");
} else {
  document.querySelector("[data-settings-theme]").value = "day";
  setTheme("day");
}

// Update the "Show more" button
updateListButton();

// Attach event listeners to various elements
document
  .querySelector("[data-list-button]")
  .addEventListener("click", showMore);

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = filterBooks(formData);
    updateList(result);
    document.querySelector("[data-search-overlay]").open = false;
  });

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    setTheme(theme);
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });
