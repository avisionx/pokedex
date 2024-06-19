import { Link } from "@remix-run/react";

export default function PokemonItem({ pokemon }) {
    const pokemonId = getPokemonIdFromUrl(pokemon.url);
    const pokemonName = pokemon.name.split('-').join(' ');
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
        <Link to={`/pokemon/${pokemonId}`}>
            <div class="shadow rounded-xl hover:scale-[101%] hover:shadow-md p-4 w-full flex flex-col items-center h-full">
                <div className="bg-muted rounded-full p-2 mb-2">
                    <img src={imageUrl} alt={pokemonName} className="size-32" />
                </div>
                <p class="text-xl capitalize text-center">{pokemonName}</p>
                <p class="font-mono text-sm text-gray-500">#{formatNumber(pokemonId)}</p>
            </div>
        </Link>
    );
}

const getPokemonIdFromUrl = (url) => {
    // Example url: https://pokeapi.co/api/v2/pokemon/id/
    const parts = url.split('/');
    return parts[parts.length - 2];
}

function formatNumber(num) {
    return num.toString().padStart(4, '0');
}