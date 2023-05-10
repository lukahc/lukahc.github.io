class NavbarCustom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("nav");
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

customElements.define("navbar-c", NavbarCustom);
