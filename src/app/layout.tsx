import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Github-API client',
	description: 'A task for NS recruitment by Martijn Senden',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-stone-200 dark:bg-stone-800 px-[6px]`}>{children}</body>
		</html>
	);
}
