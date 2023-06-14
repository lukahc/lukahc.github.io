async function getResult(idOrName) {
    const resultE = document.querySelector("#result");
    const errorE = document.querySelector("#error");
    const nameE = document.querySelector("#name");
    const idE = document.querySelector("#id");
    const typesE = document.querySelector("#types");
    const spriteE = document.querySelector("#sprite");
    const submitE = document.querySelector("#submit");
    const varietiesE = document.querySelector("#varieties");

    submitE.innerHTML = "Loading...";

    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${idOrName.toLowerCase()}`
        );
        const json = await res.json();

        const speciesRes = await fetch(json.species.url);
        const speciesJson = await speciesRes.json();
        const varieties = await Promise.all(
            speciesJson.varieties
                .filter(({ pokemon: { name } }) => name !== json.name)
                .map(async ({ pokemon: { url } }) => {
                    const varietyRes = await fetch(url);
                    const varietyJson = await varietyRes.json();
                    return varietyJson;
                })
        );

        if (varieties.length) {
            varietiesE.innerHTML =
                `<h2>Varieties</h2><div class="varieties-flexbox">` +
                varieties
                    .map(
                        (variety) =>
                            `<button onclick="getResult('${
                                variety.id
                            }');" class="variety-button"><img src=${
                                variety.sprites.other["official-artwork"]
                                    .front_default
                            } alt=${variety.name} /><div>${toTitleCase(
                                variety.name
                            )}</div></button>`
                    )
                    .join("") +
                `</div>`;
        } else {
            varietiesE.innerHTML = "";
        }

        nameE.innerHTML = toTitleCase(json.name);
        idE.innerHTML = "#" + speciesJson.id.toString().padStart(4, "0");

        const types = json.types.map(({ type: { name } }) => name);
        typesE.innerHTML = types
            .map(
                (type) =>
                    `<span class="type ${type}">${type.toUpperCase()}</span>`
            )
            .join("");

        spriteE.innerHTML = `<img src=${json.sprites.other["official-artwork"].front_default} alt="${json.name}" />`;

        errorE.className = "hidden";
        resultE.className = "result";
    } catch {
        errorE.className = "error";
        resultE.className = "hidden";
    }
    submitE.innerHTML = "Submit";
}

function toTitleCase(string) {
    const words = string.split("-");
    console.log(words);
    return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
