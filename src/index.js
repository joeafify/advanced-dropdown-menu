// Define the custom web component
// Define the custom web component
(async () => {
  class CustomSelect extends HTMLElement {
    constructor() {
      super();

      // Attach shadow DOM
      const shadow = this.attachShadow({ mode: "open" });

      // Create component structure
      shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    width:200px;
                    position: relative;
                    font-family: Arial, sans-serif;
                }
                .dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #ccc;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    display: none;
                }
                .dropdown.open {
                    display: block;
                }
                .search {
                  display:flex;
                    padding: 8px;
                    border-bottom: 1px solid #ccc;
                }
                .search input {
                    width: 100%;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .options {
                    display:flex;
                    flex-direction: column;
                    max-height: 200px;
                    overflow-y: auto;
                    width: auto;
                    padding: 8px;
                }
                .options::-webkit-scrollbar {
                  width: 5px;
                }
                
                .options::-webkit-scrollbar-track {
                  border: 1px solid #DDD; 
                  border-radius: 10px;
                }
                 
                .options::-webkit-scrollbar-thumb {
                  background: #EEE; 
                  border-radius: 5px;
                }
                
                .options::-webkit-scrollbar-thumb:hover {
                  background: #BBB; 
                }
                .option {
                    background:red;
                    padding: 8px;
                    cursor: pointer;
                }
                .option:hover {
                    background: #f0f0f0;
                }
                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    padding: 4px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    min-height: 36px;
                }
                .tag {
                    background: #e0e0e0;
                    padding: 4px 8px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                }
                .tag .remove {
                    margin-left: 4px;
                    cursor: pointer;
                }
            </style>

            <div class="tags"></div>
            <div class="dropdown">
                <div class="search">
                    <input type="text" placeholder="Search...">
                </div>
                <div class="options">
                    <slot></slot>
                </div>
            </div>
        `;

      this.tagsContainer = shadow.querySelector(".tags");
      this.searchInput = shadow.querySelector(".search input");
      this.dropdown = shadow.querySelector(".dropdown");
      this.optionsContainer = shadow.querySelector(".options");

      this.selectedValues = new Set();

      // Event Listeners
      this.searchInput.addEventListener("input", this.filterOptions.bind(this));
      this.tagsContainer.addEventListener(
        "click",
        this.toggleDropdown.bind(this)
      );
      this.optionsContainer.addEventListener(
        "click",
        this.toggleDropdown.bind(this)
      );
      this.optionsContainer.addEventListener(
        "click",
        this.selectOption.bind(this)
      );
    }

    connectedCallback() {
      this.renderOptions();
      this.openDropdown();
      console.log("Custom element added to page.");
    }

    toggleDropdown(event) {
      if (this.dropdown.classList.contains("open")) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }

    openDropdown() {
      this.dropdown.classList.add("open");
    }

    closeDropdown() {
      this.dropdown.classList.remove("open");
    }

    filterOptions(event) {
      const searchTerm = event.target.value.toLowerCase();
      const options = this.querySelectorAll("option");

      options.forEach((option) => {
        const optionText = option.textContent.toLowerCase();
        option.style.display = optionText.includes(searchTerm) ? "" : "none";
      });
    }

    selectOption(event) {
      const option = event.target.closest("option");
      if (option && !this.selectedValues.has(option.value)) {
        this.selectedValues.add(option.value);
        this.addTag(option.textContent, option.value);
      }
    }

    addTag(label, value) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.dataset.value = value;
      tag.innerHTML = `${label} <span class="remove">&times;</span>`;

      tag.querySelector(".remove").addEventListener("click", () => {
        this.removeTag(value);
      });

      this.tagsContainer.appendChild(tag);
    }

    removeTag(value) {
      this.selectedValues.delete(value);
      const tag = this.tagsContainer.querySelector(`[data-value="${value}"]`);
      if (tag) tag.remove();
    }

    renderOptions() {
      const options = Array.from(this.querySelectorAll("option"));
      options.forEach((option) => {
        const div = document.createElement("div");
        div.className = "option";
        div.dataset.value = option.value;
        div.textContent = option.textContent;
        this.optionsContainer.appendChild(div);
      });
    }
  }

  // Define the custom element
  customElements.define("advanced-select", CustomSelect);

  function logValue(e) {
    console.log(e);
  }

  const getData = async () => {
    const response = await fetch("https://api.apis.guru/v2/list.json");
    const data = await response.json();
    const keys = Object.keys(data);
    const customSelectElement = document.getElementById("advanced-select");
    for (let i = 0; i < keys.length; i++) {
      const newOption = new Option(`${keys[i]}`, `${keys[i]}`, false, false);
      customSelectElement.appendChild(newOption);
    }
  };

  await getData();
})();
