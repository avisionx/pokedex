export const getPokemonIdFromUrl = (url) => {
    // Example url: https://pokeapi.co/api/v2/pokemon/id/
    const parts = url.split('/');
    return parts[parts.length - 2];
}

export function formatNumber(num) {
    return num.toString().padStart(4, '0');
}

export async function fetchPokemonDetails(id) {
    try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        ]);

        const [pokemon, species] = await Promise.all([
            pokemonResponse.json(),
            speciesResponse.json()
        ]);

        const evolutionChainResponse = await fetch(species.evolution_chain.url);
        const evolutionChain = await evolutionChainResponse.json();

        return { pokemon, species, evolutionChain };
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        return {}
    }
}

export function getPokemonImage(sprites, type, side) {
    return sprites[`${side}_${type}`]
}

export function getEvolutionChain(chain) {
    const evolutions = [];
    let current = chain;
    while (current && current.species) {
        evolutions.push({ name: current.species.name, id: getPokemonIdFromUrl(current.species.url) });
        current = current.evolves_to[0];
    }
    return evolutions;
}

export function getWeaknesses(types) {
    const typeData = {
        normal: ['fighting'],
        fighting: ['flying', 'psychic', 'fairy'],
        flying: ['rock', 'electric', 'ice'],
        poison: ['ground', 'psychic'],
        ground: ['water', 'grass', 'ice'],
        rock: ['fighting', 'ground', 'steel', 'water', 'grass'],
        bug: ['flying', 'rock', 'fire'],
        ghost: ['ghost', 'dark'],
        steel: ['fighting', 'ground', 'fire'],
        fire: ['ground', 'rock', 'water'],
        water: ['grass', 'electric'],
        grass: ['flying', 'poison', 'bug', 'fire', 'ice'],
        electric: ['ground'],
        psychic: ['bug', 'ghost', 'dark'],
        ice: ['fighting', 'rock', 'steel', 'fire'],
        dragon: ['ice', 'dragon', 'fairy'],
        dark: ['fighting', 'bug', 'fairy'],
        fairy: ['poison', 'steel'],
    };

    const weaknesses = new Set();
    types.forEach(type => {
        typeData[type.type.name].forEach(weakness => weaknesses.add(weakness));
    });

    return Array.from(weaknesses);
}