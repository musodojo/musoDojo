class Container {
  constructor() {
    this.container = document.createElement("div");
    this.container.style.position = "relative";
  }

  render(container) {
    this.container.appendChild(container);
  }
}

export { Container };
