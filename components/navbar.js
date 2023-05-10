class Navbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar">
                <p>Home</p>
                <p>Page</p>
                <p>Page</p>
                <p>Page</p>
            </nav>
        `;
    }
}

customElements.define("navbar-c", Navbar);
