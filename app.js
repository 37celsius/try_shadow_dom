/*
2 Types: 
- Autonomouse custom element <myelement></myelement>
- Customized built-in elements

Append order does matter

class MyElement extends HTMLElement {

  // return an array of the attribute names you want to watch for changes.
  static get observedAttributes() {
    return ['attribute'];
  }

  // called when the element is first created. you mus call 'super()'
  constructor(){
    super();
  }

  // called when the element is added to the DOM
  connectedCallback(){}

  // called when the element is removed from the DOM
  disconnectedCallback(){}

  // called when one of your 'observedAttributes' changes
  attributeChangedCallback(attr, oldValue, newValue) {}

}

// first parameter is the tag name, second is the class name
customElements.define('my-element', MyElement);
*/

class Myshadow extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("span");
    const text = this.getAttribute("text");
    wrapper.textContent = text;
    shadow.appendChild(wrapper);
    wrapper.classList.add("shadow-style");
    const style = document.createElement("style");

    style.textContent = "@import './shadow.css';";

    shadow.appendChild(style);

    const slotHeader = document.createElement("slot");
    const slotContent = document.createElement("slot");
    slotHeader.setAttribute("name", "shadowHeader");
    slotContent.setAttribute("name", "shadowContent");
    wrapper.appendChild(slotHeader);
    wrapper.appendChild(slotContent);

    let isGreen = false;
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerText = "Change to green";
    wrapper.appendChild(button);

    function toggleColor() {
      if (isGreen) {
        slotContent.classList.remove("shadow-style--green");
        button.innerText = "Change to green";
        isGreen = false;
      } else {
        slotContent.classList.add("shadow-style--green");
        button.innerText = "Change to red";
        isGreen = true;
      }
    }

    button.onclick = toggleColor;
  }
}

customElements.define("my-shadow", Myshadow);
