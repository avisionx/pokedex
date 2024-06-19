import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";

async function fetchPokemonDetails(id) {
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const pokemon = await pokemonResponse.json();
    const species = await speciesResponse.json();

    const evolutionChainResponse = await fetch(species.evolution_chain.url);
    const evolutionChain = await evolutionChainResponse.json();

    return { pokemon, species, evolutionChain };
}

export async function loader({ params }) {
    const data = await fetchPokemonDetails(params.id);
    if (!data.pokemon) {
        throw new Response("Not Found", { status: 404 });
    }
    return json(data);
}

function getEvolutionChain(chain) {
    const evolutions = [];
    let current = chain;
    while (current && current.species) {
        evolutions.push(current.species.name);
        current = current.evolves_to[0];
    }
    return evolutions;
}

function getWeaknesses(types) {
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

export default function PokemonDetails() {
    const { pokemon, species, evolutionChain } = useLoaderData();
    const evolutions = getEvolutionChain(evolutionChain.chain);
    const weaknesses = getWeaknesses(pokemon.types);

    return (
        <div className="flex justify-center items-center bg-gray-100 p-4">
            <Card className="max-w-3xl w-full">
                <CardHeader>
                    <div className="flex items-center">
                        <CardTitle className="text-3xl capitalize mr-4">{pokemon.name}</CardTitle>
                        <Badge className="text-lg">#{pokemon.id}</Badge>
                    </div>
                    <CardDescription className="capitalize mt-2">
                        {pokemon.types.map((type) => type.type.name).join(", ")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Default</h3>
                                <img
                                    src={pokemon.sprites.front_default}
                                    alt={`${pokemon.name} default`}
                                    className="w-24 h-24"
                                />
                                <img
                                    src={pokemon.sprites.back_default}
                                    alt={`${pokemon.name} back`}
                                    className="w-24 h-24 mt-2"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Shiny</h3>
                                <img
                                    src={pokemon.sprites.front_shiny}
                                    alt={`${pokemon.name} shiny`}
                                    className="w-24 h-24"
                                />
                                <img
                                    src={pokemon.sprites.back_shiny}
                                    alt={`${pokemon.name} shiny back`}
                                    className="w-24 h-24 mt-2"
                                />
                            </div>
                            {pokemon.sprites.front_female && (
                                <div>
                                    <h3 className="text-lg font-semibold">Female</h3>
                                    <img
                                        src={pokemon.sprites.front_female}
                                        alt={`${pokemon.name} female`}
                                        className="w-24 h-24"
                                    />
                                    {pokemon.sprites.back_female && (
                                        <img
                                            src={pokemon.sprites.back_female}
                                            alt={`${pokemon.name} female back`}
                                            className="w-24 h-24 mt-2"
                                        />
                                    )}
                                </div>
                            )}
                            {pokemon.sprites.front_shiny_female && (
                                <div>
                                    <h3 className="text-lg font-semibold">Shiny Female</h3>
                                    <img
                                        src={pokemon.sprites.front_shiny_female}
                                        alt={`${pokemon.name} shiny female`}
                                        className="w-24 h-24"
                                    />
                                    {pokemon.sprites.back_shiny_female && (
                                        <img
                                            src={pokemon.sprites.back_shiny_female}
                                            alt={`${pokemon.name} shiny female back`}
                                            className="w-24 h-24 mt-2"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 w-full">
                            <h2 className="text-xl font-semibold mb-2">Stats</h2>
                            <ul className="mb-4">
                                {pokemon.stats.map((stat) => (
                                    <li key={stat.stat.name} className="flex justify-between">
                                        <span className="capitalize">{stat.stat.name}</span>
                                        <span>{stat.base_stat}</span>
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Details</h2>
                            <ul className="mb-4">
                                <li className="flex justify-between">
                                    <span>Height</span>
                                    <span>{pokemon.height / 10} m</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Weight</span>
                                    <span>{pokemon.weight / 10} kg</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Category</span>
                                    <span className="capitalize">{species.genera.find(gen => gen.language.name === 'en').genus}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Gender</span>
                                    <span>{species.gender_rate === -1 ? "Genderless" : `Male: ${(8 - species.gender_rate) / 8 * 100}%, Female: ${species.gender_rate / 8 * 100}%`}</span>
                                </li>
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Abilities</h2>
                            <ul className="mb-4">
                                {pokemon.abilities.map((ability) => (
                                    <li key={ability.ability.name} className="capitalize">
                                        {ability.ability.name} {ability.is_hidden && <Badge className="ml-2">Hidden</Badge>}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Weaknesses</h2>
                            <ul className="mb-4">
                                {weaknesses.map((weakness) => (
                                    <li key={weakness} className="capitalize">
                                        {weakness}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Evolutions</h2>
                            <ul className="mb-4">
                                {evolutions.map((evolution) => (
                                    <li key={evolution} className="capitalize">
                                        {evolution}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Moves</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {pokemon.moves.map((move) => (
                                    <li key={move.move.name} className="capitalize">
                                        {move.move.name}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p>{species.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
