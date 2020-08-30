/*
Use Polyfills for older browser:
https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs

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

const MyShadowDiv = document.getElementById("my-shadow-host");
const MyShadowRootDiv = MyShadowDiv.attachShadow({ mode: "open" });
MyShadowRootDiv.innerHTML = `This is from app.js This is from the HTML using slot --> <slot></slot>`;

const fragment = document.getElementById("my-shadow-list-template");
const books = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "A Farewell to Arms", author: "Ernest Hemingway" },
  { title: "Catch 22", author: "Joseph Heller" },
];

books.forEach((book) => {
  // Create an instance of the template content
  const instance = document.importNode(fragment.content, true);

  // Add relevant content to the template
  instance.querySelector(".title").innerHTML = book.title;
  instance.querySelector(".author").innerHTML = book.author;

  // Append the instance to the DOM
  document.getElementById("my-shadow-list").appendChild(instance);
});

/*
  document.importNode method is a function that will create a copy of the template's content and prepare it to be inserted into another document (or document fragment). The first argument to the function grabs the template's content and the second agrument tells the browser to do a deep copy of the element's DOM subtree.

  Example below:
*/

function appendBooks(templateId) {
  const bookList = document.getElementById("books");
  const fragment = document.getElementById(templateId);

  // clear out the content from the ul
  bookList.innerHTML = "";

  // Loop over the books and modify the given template
  books.forEach((book) => {
    const instance = document.importNode(fragment.content, true);

    // Add relevant content to the template
    instance.querySelector(".title").innerHTML = book.title;
    instance.querySelector(".author").innerHTML = book.author;

    // Append the instance to the DOM
    bookList.appendChild(instance);
  });
}

document
  .getElementById("templates")
  .addEventListener("change", (event) => appendBooks(event.target.value));

appendBooks("book-template-1");
