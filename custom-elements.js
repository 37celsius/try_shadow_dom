/*
  The connectedCallback is separate from the element's constructor.
  Wherease the constructor is used to set up the bare bones of the element,
  the connectedCallback is typically used for adding content to the element, setting up event listeners or otherwise initializing the component.
*/

/*
  GETTER AND SETTER

  getter -> access properties
  setter -> change (mutate) them

  const person = {
    firstName: 'Hello',
    lastName: 'World',
    get fullName() {
      return `${person.firstName} ${person.lastName}`
    },
    set fullName(value) {
      const parts = value.split('');
      this.firstName = parts[0];
      this.lastName = parts[1];
    }
  }

  console.log(person.fullName) -> Hello World
  person.fullName = 'John Doe';
  console.log(person.fullName) -> John Doe
  console.log(person) -> { firstName: 'John', lastName: 'Doe', ...} 
*/

class OneDialog extends HTMLElement {
  // The static keyword defines a static method for a class. Static methods aren't called on instances of the class. Instead, they're called on the class itself.

  // observedAttributes is part of web component
  static get observedAttributes() {
    return ["openModal"];
  }

  constructor() {
    super();
    this.close = this.close.bind(this);
    this._watchEscape = this._watchEscape.bind(this);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[attrName] = this.hasAttribute(attrName);
    }
  }

  connectedCallback() {
    const template = document.getElementById("dialog-template");
    const node = document.importNode(template.content, true);
    this.appendChild(node);

    this.querySelector("button").addEventListener("click", this.close);
    this.querySelector(".overlay").addEventListener("click", this.close);
    this.open = this.open;
  }

  disconnectedCallback() {
    this.querySelector("button").removeEventListener("click", this.close);
    this.querySelector(".overlay").removeEventListener("click", this.close);
  }

  /*
    Our getter and setter will keep the openModal attribute and property values in sync.
    Adding the openModal attribute will set element.open to true and setting element.open to true will ad the openModal attribute <one-dialog openModal="">...</one-dialog>
  */

  get open() {
    // return true or false if the element has attribute of openModal
    return this.hasAttribute("openModal");
  }

  set open(isOpen) {
    this.querySelector(".wrapper").classList.toggle("open", isOpen);
    // Smart way to toggle aria-hidden, if isOpen => true, aria-hidden => false
    this.querySelector(".wrapper").setAttribute("aria-hidden", !isOpen);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute("openModal", "");
      document.addEventListener("keydown", this._watchEscape);
      this.focus();
      this.querySelector("button").focus();
    } else {
      this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
      this.removeAttribute("openModal");
      document.removeEventListener("keydown", this._watchEscape);
      this.close();
    }
  }

  close() {
    if (this.open !== false) {
      this.open = false;
    }

    // The CustomEvent interface represents events initialized by an application for any purpose.
    const closeEvent = new CustomEvent("dialog-closed");

    // Dispatches an Event at the specified EventTarget, (synchronously) invoking the affected EventListeners in the appropriate order.
    this.dispatchEvent(closeEvent);
  }

  _watchEscape(event) {
    if (event.key == "Escape") {
      this.close();
    }
  }
}

customElements.define("one-dialog", OneDialog);
const button = document.getElementById("launch-dialog");
button.addEventListener("click", () => {
  document.querySelector("one-dialog").open = true;
});
