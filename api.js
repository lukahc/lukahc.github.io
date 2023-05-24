async function getName(num) {
    const resultE = document.querySelector("#result");
    const nameE = document.querySelector("#name");
    const typesE = document.querySelector("#types");
    const spriteE = document.querySelector("#sprite");
    const submitE = document.querySelector("#submit");
    submitE.value = "Loading...";
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
        const json = await res.json();
        resultE.innerHTML = toTitleCase(json.name);
    } catch {
        resultE.innerHTML = "Invalid input";
    }
    submitE.value = "Submit";
    resultE.className = "result";
}
function toTitleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}
