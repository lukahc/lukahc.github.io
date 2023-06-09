// TODO:
//  - Fix Porygon-Z being shown as Porygon Z
//  - Fix mega pokemon having 'Mega' at the end of their name (eg. 'Blastoise Mega' instead of 'Mega Blastoise')
//    - Note: Pokemon with multiple mega evolutions (Charizard and Mewtwo) make this more complicated
//  - Handle pokemon with multiple evolution lines (eg. Snorunt -> Froslass or Glalie)
//  - Handle inputting pokemon names without specifying variety (eg. 'Deoxys' should default to 'Deoxys Normal')
//  - Handle pokemon without an obvious default variety (eg. Urshifu Single Strike/Rapid Strike)
//  - Display Gigantamax properly (eg. 'Charizard Gmax' should be 'Gigantamax Charizard')
//  - Display gender differences if notable (eg. Combee)
//  - Display evolution requirements

async function getResult(idOrName) {
    const resultE = document.querySelector("#result");
    const errorE = document.querySelector("#error");
    const nameE = document.querySelector("#name");
    const idE = document.querySelector("#id");
    const typesE = document.querySelector("#types");
    const spriteE = document.querySelector("#sprite");
    const submitE = document.querySelector("#submit");
    const varietiesE = document.querySelector("#varieties");
    const evolutionE = document.querySelector("#evolution");

    submitE.innerHTML = "Loading...";

    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${idOrName
                .replaceAll(" ", "-")
                .toLowerCase()}`
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
        const evolutionChain = await getEvolutionChain(
            speciesJson.evolution_chain.url
        );

        if (evolutionChain.length > 1) {
            evolutionE.innerHTML =
                `<h2>Evolution Chain</h2><div class="flexbox">` +
                evolutionChain
                    .map(
                        (pokemon) =>
                            `<button onclick="getResult('${
                                pokemon.id
                            }');" class="pokemon-button"><img src=${
                                pokemon.sprites.other["official-artwork"]
                                    .front_default
                            } alt=${
                                pokemon.name
                            }/><div class="name-text">${toTitleCase(
                                pokemon.name
                            )}</div></button>`
                    )
                    .join(`<div class="arrow">⇨</div>`) +
                `</div>`;
        } else {
            evolutionE.innerHTML = "";
        }

        if (varieties.length) {
            varietiesE.innerHTML =
                `<h2>Varieties</h2><div class="flexbox">` +
                varieties
                    .map(
                        (variety) =>
                            `<button onclick="getResult('${
                                variety.id
                            }');" class="pokemon-button"><img src=${
                                variety.sprites.other["official-artwork"]
                                    .front_default
                            } alt=${
                                variety.name
                            } /><div class="name-text">${toTitleCase(
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
    return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

async function getNextEvolution(stage, arr) {
    arr.push(stage.species.url);
    if (stage.evolves_to.length) {
        return await getNextEvolution(stage.evolves_to[0], arr);
    } else {
        return arr;
    }
}

async function getEvolutionChain(url) {
    const res = await fetch(url);
    const json = await res.json();
    const urlArray = await getNextEvolution(json.chain, []);

    const pokemonArray = await Promise.all(
        urlArray.map(async (url) => {
            const speciesRes = await fetch(url);
            const speciesJson = await speciesRes.json();
            const defaultUrl = speciesJson.varieties.filter(
                ({ is_default }) => is_default
            )[0].pokemon.url;
            const pokemonRes = await fetch(defaultUrl);
            const pokemonJson = await pokemonRes.json();
            return pokemonJson;
        })
    );

    return pokemonArray;
}
