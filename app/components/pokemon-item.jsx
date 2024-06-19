import { Link } from "@remix-run/react";
import { formatNumber, getPokemonIdFromUrl } from "~/lib/helpers";

export default function PokemonItem({ pokemon }) {
    const pokemonId = getPokemonIdFromUrl(pokemon.url);
    const pokemonName = pokemon.name.split('-').join(' ');
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
        <Link to={`/pokemon/${pokemonId}`}>
            <div className="shadow rounded-xl hover:scale-[101%] hover:shadow-md p-4 w-full flex flex-col items-center h-full">
                <div className="bg-muted rounded-full p-2 mb-2">
                    <img src={imageUrl} alt={pokemonName} className="size-32" />
                </div>
                <p className="text-xl capitalize text-center">{pokemonName}</p>
                <p className="font-mono text-sm text-gray-500">#{formatNumber(pokemonId)}</p>
            </div>
        </Link>
    );
}