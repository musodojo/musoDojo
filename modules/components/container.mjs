class Container {
  constructor() {
    this.container = document.createElement("div");
  }

  render(container) {
    this.container.appendChild(container);
  }
}

export { Container };
