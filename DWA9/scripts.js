import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
// import { BookPreview } from "./preview.js";
/**
 * The application state.
 * @typedef {Object} State
 * @property {number} page - The current page number.
 * @property {Array} matches - The list of matched books.
 */

function createBookApp({
  books,
  authors,
  genres,
  BOOKS_PER_PAGE,
  startingElement,
  listItemsSelector,
  searchGenresSelector,
  searchAuthorsSelector,
  searchFormSelector,
  listButtonSelector,
  searchOverlaySelector,
  settingsFormSelector,
  settingsOverlaySelector,
  settingsThemeSelector,
  searchCancelSelector,
  settingsCancelSelector,
  headerSearchSelector,
  headerSettingsSelector,
}) {
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
   * Create options for select elements.
   *
   * @param {Object} data - The data for options.
   * @param {string} placeholderText - The text for the placeholder option.
   * @returns {DocumentFragment} The document fragment containing options.
   */
  function createSelectOptions(data, placeholderText) {
    const fragment = document.createDocumentFragment();
    const firstOption = document.createElement("option");
    firstOption.value = "any";
    firstOption.innerText = placeholderText;
    fragment.appendChild(firstOption);

    for (const [id, name] of Object.entries(data)) {
      const element = document.createElement("option");
      element.value = id;
      element.innerText = name;
      fragment.appendChild(element);
    }

    return fragment;
  }

  /**
   * Set the theme of the application.
   *
   * @param {string} theme - The theme ('night' or 'day').
   */
  function setTheme(theme) {
    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
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
   * Update the "Show more" button's text.
   */
  function updateButtonText() {
    const remaining = state.matches.length - state.page * BOOKS_PER_PAGE;
    const buttonText = `Show more (${remaining > 0 ? remaining : 0})`;
    document.querySelector("[data-list-button]").innerText = buttonText;
  }

  /**
   * Enable/disable the "Show more" button.
   */
  function updateButtonState() {
    const remaining = state.matches.length - state.page * BOOKS_PER_PAGE;
    const isDisabled = remaining <= 0;
    document.querySelector("[data-list-button]").disabled = isDisabled;
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
    updateButtonText();
    updateButtonState();
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
   * Locate a book based on the preview element.
   *
   * @param {Element} previewElement - The clicked preview element.
   * @returns {Object} The located book.
   */
  function locateBook(previewElement) {
    const previewId = previewElement.dataset.preview;
    return books.find((book) => book.id === previewId);
  }

  /**
   * Display book details.
   *
   * @param {Object} book - The book to display.
   */
  function displayBookDetails(book) {
    const listActive = document.querySelector("[data-list-active]");
    listActive.open = true;
    document.querySelector("[data-list-blur]").src = book.image;
    document.querySelector("[data-list-image]").src = book.image;
    document.querySelector("[data-list-title]").innerText = book.title;
    document.querySelector("[data-list-subtitle]").innerText = `${
      authors[book.author]
    } (${new Date(book.published).getFullYear()})`;
    document.querySelector("[data-list-description]").innerText =
      book.description;
  }

  document
    .querySelector("[data-list-items]")
    .addEventListener("click", (event) => {
      const previewElement = event.target;
      if (previewElement && previewElement.dataset.preview) {
        const book = locateBook(previewElement);
        if (book) {
          displayBookDetails(book);
        }
      }
    });

  // Initialize the page
  function initializePage() {
    const starting = document.createDocumentFragment();
    for (const book of state.matches.slice(0, BOOKS_PER_PAGE)) {
      starting.appendChild(createPreviewElement(book));
    }

    document.querySelector(listItemsSelector).appendChild(starting);

    // Populate genre and author options
    document.querySelector("[data-list-items]").appendChild(starting);
    document
      .querySelector(searchGenresSelector)
      .appendChild(createSelectOptions(genres, "All Genres"));

    document
      .querySelector(searchAuthorsSelector)
      .appendChild(createSelectOptions(authors, "All Authors"));

    // Check the user's preferred theme and set it
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.querySelector(settingsThemeSelector).value = "night";
      setTheme("night");
    } else {
      document.querySelector(settingsThemeSelector).value = "day";
      setTheme("day");
    }

    // Update the "Show more" button
    updateButtonText();
    updateButtonState();

    // Attach event listeners to various elements
    document
      .querySelector(listButtonSelector)
      .addEventListener("click", showMore);

    document
      .querySelector(searchFormSelector)
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const result = filterBooks(formData);
        updateList(result);
        document.querySelector(searchOverlaySelector).open = false;
      });

    document
      .querySelector(settingsFormSelector)
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        setTheme(theme);
        document.querySelector(settingsOverlaySelector).open = false;
      });

    document
      .querySelector(searchCancelSelector)
      .addEventListener("click", () => {
        document.querySelector(searchOverlaySelector).open = false;
      });

    document
      .querySelector(settingsCancelSelector)
      .addEventListener("click", () => {
        document.querySelector(settingsOverlaySelector).open = false;
      });

    document
      .querySelector(headerSearchSelector)
      .addEventListener("click", () => {
        document.querySelector(searchOverlaySelector).open = true;
        document.querySelector("[data-search-title]").focus();
      });

    document
      .querySelector(headerSettingsSelector)
      .addEventListener("click", () => {
        document.querySelector(settingsOverlaySelector).open = true;
      });
  }

  // Initialization
  initializePage();

  return {
    updateList,
    showMore,
    displayBookDetails,
    // attachEventListeners,
  };
}

// Example usage:
const bookApp = createBookApp({
  books,
  authors,
  genres,
  BOOKS_PER_PAGE,
  startingElement: document.querySelector("[data-list-items]"),
  listItemsSelector: "[data-list-items]",
  searchGenresSelector: "[data-search-genres]",
  searchAuthorsSelector: "[data-search-authors]",
  searchFormSelector: "[data-search-form]",
  listButtonSelector: "[data-list-button]",
  searchOverlaySelector: "[data-search-overlay]",
  settingsFormSelector: "[data-settings-form]",
  settingsOverlaySelector: "[data-settings-overlay]",
  settingsThemeSelector: "[data-settings-theme]",
  searchCancelSelector: "[data-search-cancel]",
  settingsCancelSelector: "[data-settings-cancel]",
  headerSearchSelector: "[data-header-search]",
  headerSettingsSelector: "[data-header-settings]",
});

// Attach event listeners
// bookApp.attachEventListeners();
