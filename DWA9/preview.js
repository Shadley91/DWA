import { authors } from "./data.js";

export class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { author, id, image, title } = this.getAttributes();
    this.render(author, id, image, title);
  }

  getAttributes() {
    return {
      author: this.getAttribute("author"),
      id: this.getAttribute("id"),
      image: this.getAttribute("image"),
      title: this.getAttribute("title"),
    };
  }

  render(author, id, image, title) {
    this.shadowRoot.innerHTML = `
      <style>
      .preview {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: transform 0.3s ease-in-out;
      }
      
      .preview:hover {
        transform: scale(1.05);
      }
      
      .preview__image {
        width: 80px;
        height: 120px;
        object-fit: cover;
        margin-right: 10px;
        border-radius: 3px;
      }
      
      .preview__info {
        flex: 1;
      }
      
      .preview__title {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
      }
      
      .preview__author {
        color: #666;
      }
      </style>
      <button class="preview" data-preview="${id}">
      <img
      class="preview__image"
      src="${image}"
  />
  
  <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
  </div>
      </button>
    `;
  }
}

customElements.define("book-preview", BookPreview);
