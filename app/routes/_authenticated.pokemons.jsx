import { json, useFetcher, useLoaderData } from '@remix-run/react';
import { CircleUserRoundIcon, LogOut } from 'lucide-react';
import PokemonList from '~/components/pokemon-list';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export const loader = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${20}&offset=${0}`);
    const data = await response.json();
    return json(data);
};

export default function Pokemons() {
    const data = useLoaderData();
    const fetcher = useFetcher();

    return (
        <div className='px-6 py-4'>
            <div className='flex items-center justify-between mb-5'>
                <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Pokédex
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CircleUserRoundIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-3">
                        <DropdownMenuItem>
                            <fetcher.Form method='post' action='/actions/logout'>
                                <button className='flex items-center' type='submit'>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </button>
                            </fetcher.Form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <PokemonList initialData={data} />
        </div>
    );
}

