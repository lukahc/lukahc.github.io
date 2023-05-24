async function getName(num) {
    const resultE = document.querySelector("#result");
    const errorE = document.querySelector("#error");
    const nameE = document.querySelector("#name");
    const typesE = document.querySelector("#types");
    const spriteE = document.querySelector("#sprite");
    const submitE = document.querySelector("#submit");
    submitE.value = "Loading...";
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
        const json = await res.json();
        nameE.innerHTML = toTitleCase(json.name);
        errorE.className = "error hidden";
        resultE.className = "result";
    } catch {
        errorE.className = "error";
        resultE.className = "result hidden";
    }
    submitE.value = "Submit";
}
function toTitleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}
