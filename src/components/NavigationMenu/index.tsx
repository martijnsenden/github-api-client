import Link from 'next/link';
import {
	Item as NavigationMenuItem,
	Link as NavigationMenuLink,
	List as NavigationMenuList,
	Root as NavigationMenuRoot,
} from '@radix-ui/react-navigation-menu';

export function NavigationMenu() {
	return (
		<NavigationMenuRoot>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/search">Search</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/history">Search history</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenuRoot>
	);
}
