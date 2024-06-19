import { useState, useRef } from 'react';
import PokemonItem from './pokemon-item';
import PokemonItemLoader from './pokemon-item-loader';

export default function PokemonList({ initialData }) {
    const [pokemons, setPokemons] = useState(initialData.results);
    const [nextUrl, setNextUrl] = useState(initialData.next);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const lastPokemonElementRef = (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextUrl && !loading) {
                fetchMorePokemons();
            }
        });
        if (node) observer.current.observe(node);
    };

    const fetchMorePokemons = async () => {
        setLoading(true);
        const response = await fetch(nextUrl);
        const data = await response.json();
        setPokemons(prev => [...prev, ...data.results]);
        setNextUrl(data.next);
        setLoading(false);
    };

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
            {pokemons.map((pokemon, i) => <div key={pokemon.url} ref={i + 1 === pokemons.length ? lastPokemonElementRef : null}><PokemonItem pokemon={pokemon} /></div>)}
            {loading && <PokemonItemLoader />}
        </div>
    );
};
