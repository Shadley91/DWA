import { LitElement, html, css } from "lit";

class CounterComponent extends LitElement {
  static get styles() {
    return css`
      button {
        margin: 5px;
      }
    `;
  }

  static get properties() {
    return {
      numberValue: { type: Number },
      counterState: { type: String },
      maxNumber: { type: Number },
      minNumber: { type: Number },
      stepAmount: { type: Number },
    };
  }

  constructor() {
    super();
    this.maxNumber = 15;
    this.minNumber = -5;
    this.stepAmount = 5;
    this.numberValue = 0;
    this.counterState = "Normal";
  }

  subtractHandler() {
    const newValue = this.numberValue - this.stepAmount;
    this.numberValue = newValue;

    if (this.numberValue <= this.minNumber) {
      this.counterState = "Minimum Reached";
    } else {
      this.counterState = "Normal";
    }
  }

  addHandler() {
    const newValue = this.numberValue + this.stepAmount;
    this.numberValue = newValue;

    if (this.numberValue >= this.maxNumber) {
      this.counterState = "Maximum Reached";
    } else {
      this.counterState = "Normal";
    }
  }

  render() {
    return html`
      <div>
        <input type="text" .value="${this.numberValue}" disabled />
        <button
          @click="${this.subtractHandler}"
          ?disabled="${this.counterState === "Minimum Reached"}"
        >
          -
        </button>
        <button
          @click="${this.addHandler}"
          ?disabled="${this.counterState === "Maximum Reached"}"
        >
          +
        </button>
        <p>${this.counterState}</p>
      </div>
    `;
  }
}

customElements.define("counter-component", CounterComponent);
