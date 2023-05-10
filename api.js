async function getName(num) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
    const json = await res.json();
    console.log(json.name);
}
