import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	NavigationMenu as NavigationMenuRoot,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';

export function NavigationMenu() {
	const pathname = usePathname();

	return (
		<NavigationMenuRoot>
			<NavigationMenuList className="gap-2">
				<NavigationMenuItem
					className={`border-b-4 border-b-transparent mb-3 pb-1 pt-4 px-3 text-blue-heading ${
						pathname === '/search'
							? 'bg-gray-backgrounds border-b-yellow-borders hover:cursor-default font-bold'
							: 'hover:border-b-yellow-borders hover:cursor-pointer font-medium'
					}`}
				>
					{pathname === '/search' ? (
						'Search'
					) : (
						<NavigationMenuLink asChild>
							<Link href="/search">Search</Link>
						</NavigationMenuLink>
					)}
				</NavigationMenuItem>
				<NavigationMenuItem
					className={`border-b-4 border-b-transparent mb-3 pb-1 pt-4 px-3 text-blue-heading ${
						pathname === '/history'
							? 'bg-gray-backgrounds border-b-yellow-borders hover:cursor-default font-bold'
							: 'hover:border-b-yellow-borders hover:cursor-pointer font-medium'
					}`}
				>
					{pathname === '/history' ? (
						'History'
					) : (
						<NavigationMenuLink asChild>
							<Link href="/history">History</Link>
						</NavigationMenuLink>
					)}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenuRoot>
	);
}
