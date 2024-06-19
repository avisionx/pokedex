import { useFetcher } from '@remix-run/react';
import { CircleUserRoundIcon, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';


export default function Pokemons() {
    const fetcher = useFetcher();

    return (
        <div className='px-6 py-4'>
            <div className='flex items-center justify-between'>
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
        </div>
    );
}

