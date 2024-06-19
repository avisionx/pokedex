import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeftIcon, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { fetchPokemonDetails, formatNumber, getEvolutionChain, getPokemonImage, getWeaknesses } from "~/lib/helpers";

export async function loader({ params }) {
    const data = await fetchPokemonDetails(params.id);
    if (!data.pokemon) {
        throw new Response("Not Found", { status: 404 });
    }
    return json(data);
}

export const meta = ({ data }) => {
    const pokemonName = data.pokemon.name.split('-').join(' ').replace(/\b\w/g, char => char.toUpperCase());
    return [{ title: `${pokemonName} | Pokédex` }]
}

export default function Pokemon() {
    const { pokemon, species, evolutionChain } = useLoaderData();
    const evolutions = getEvolutionChain(evolutionChain.chain);
    const weaknesses = getWeaknesses(pokemon.types);

    const [pokemonImageType, setPokemonImageType] = useState('default')

    const changePokemonImageType = (value) => {
        setPokemonImageType(value);
    }

    const front_image = getPokemonImage(pokemon.sprites, pokemonImageType, 'front')
    const back_image = getPokemonImage(pokemon.sprites, pokemonImageType, 'back')

    return (
        <div className="flex bg-white px-6 py-4">
            <div className="mx-auto max-w-3xl w-full flex gap-3 flex-col">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon">
                        <Link to='/pokemons' replace>
                            <ArrowLeftIcon />
                        </Link>
                    </Button>
                    <h1 className="mx-auto capitalize scroll-m-20 text-2xl font-semibold tracking-tight">{pokemon.name.split('-').join(' ')}</h1>
                    <div className="w-[40px]"></div>
                </div>
                <p className="font-mono text-center text-sm text-gray-500 mt-[-12px]">#{formatNumber(pokemon.id)}</p>
                <div className="flex items-center justify-center gap-3">
                    {pokemon.types.map((type) => <Badge variant="secondary" className="text-xs font-mono hover:bg-primary hover:text-white cursor-pointer" key={type.type.name}>{type.type.name}</Badge>)}
                </div>
                <div className="w-[50%] mx-auto my-2">
                    <Select defaultValue='default' onValueChange={changePokemonImageType} value={pokemonImageType}>
                        <SelectTrigger aria-label="select type">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            {pokemon.sprites.front_shiny && <SelectItem value="shiny">Shiny</SelectItem>}
                            {pokemon.sprites.front_female && <SelectItem value="female">Female</SelectItem>}
                            {pokemon.sprites.front_shiny_female && <SelectItem value="shiny_female">Shiny Female</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                <div className={`grid grid-cols-${back_image ? 2 : 1} gap-12 mb-4 mt-1 mx-auto`}>
                    <div className="flex items-center flex-col gap-2">
                        <div className="bg-muted rounded-full p-2">
                            <img
                                src={front_image}
                                alt=""
                                className="size-48"
                            />
                        </div>
                        <p className="font-mono text-xs font-bold tracking-widest text-gray-500">FRONT</p>
                    </div>
                    {back_image && <div className="flex items-center flex-col gap-2">
                        <div className="bg-muted rounded-full p-2">
                            <img
                                src={back_image}
                                alt=""
                                className="size-48"
                            />
                        </div>
                        <p className="font-mono text-xs font-bold tracking-widest text-gray-500">BACK</p>
                    </div>}
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Details</p>
                    <p className="text-muted-foreground mb-1">{species.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text}</p>
                    <ul>
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
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Stats</p>
                    <ul>
                        {pokemon.stats.map((stat) => (
                            <li key={stat.stat.name} className="flex justify-between">
                                <span className="capitalize">{stat.stat.name.split('-').join(' ')}</span>
                                <span>{stat.base_stat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Abilities</p>
                    <ul>
                        {pokemon.abilities.map((ability) => (
                            <li key={ability.ability.name} className="capitalize flex items-center">
                                {ability.ability.name.split('-').join(' ')} {ability.is_hidden && <Badge variant='outline' className="ml-2 text-xs">Hidden</Badge>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Weaknesses</p>
                    <ul>
                        {weaknesses.map((weakness) => (
                            <li key={weakness} className="mb-1">
                                <Badge variant="secondary" className="text-xs font-mono hover:bg-primary hover:text-white cursor-pointer">{weakness}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Evolutions</p>
                    <Breadcrumb className="mt-1">
                        <BreadcrumbList>
                            {evolutions.map(({ name, id }, i) => (
                                <Fragment key={id}>
                                    <BreadcrumbItem>
                                        <Link to={`/pokemon/${id}`} className="text-[16px] text-black">
                                            {name.split('-').join(' ').replace(/\b\w/g, char => char.toUpperCase())}
                                        </Link>
                                    </BreadcrumbItem>
                                    {i + 1 !== evolutions.length && <ChevronRight className="text-black size-4" />}
                                </Fragment>))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <p className="scroll-m-20 text-xl font-semibold tracking-tight">Moves</p>
                    <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {pokemon.moves.map((move) => (
                            <li key={move.move.name} className="capitalize">
                                {move.move.name.split('-').join(' ')}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
