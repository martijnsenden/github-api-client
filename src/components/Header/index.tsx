import Image from 'next/image';
import React from 'react';

import { NavigationMenu } from '@/components/NavigationMenu';

export function Header() {
	return (
		<header className="text-black bg-white border-gray-border flex flex-row items-center justify-start mb-8">
			<Image
				alt="GitHub Logo - Inverted Octocat"
				className="fill-blue-logo mx-4"
				src="/assets/images/github-mark.svg"
				width={0}
				height={0}
				style={{ width: '2em', height: 'auto' }} // optional
			/>
			<NavigationMenu />
		</header>
	);
}
