class NavbarCustom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar">
                <a href="/index.html">Home</a>
                <a>Page</a>
                <a>Page</a>
                <a>Page</a>
            </nav>
        `;
    }
}

customElements.define("navbar-c", NavbarCustom);
