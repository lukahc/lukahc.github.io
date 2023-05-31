async function getName(num) {
    const resultE = document.querySelector("#result");
    const errorE = document.querySelector("#error");
    const nameE = document.querySelector("#name");
    const idE = document.querySelector("#id");
    const typesE = document.querySelector("#types");
    const spriteE = document.querySelector("#sprite");
    const submitE = document.querySelector("#submit");
    submitE.value = "Loading...";
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
        const json = await res.json();

        nameE.innerHTML = toTitleCase(json.name);
        idE.innerHTML = "#" + json.id.toString().padStart(4, "0");

        const types = json.types.map(({ type: { name } }) => name);
        typesE.innerHTML = types
            .map(
                (type) =>
                    `<span class="type ${type}">${toTitleCase(type)}</span>`
            )
            .join("");

        spriteE.innerHTML = `<img src=${json.sprites.front_default} alt="Sprite" />`;

        errorE.className = "hidden";
        resultE.className = "result";
    } catch {
        errorE.className = "error";
        resultE.className = "hidden";
    }
    submitE.value = "Submit";
}
function toTitleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}
