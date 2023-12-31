import Image from 'next/image';
import React from 'react';

import { Repository } from '@/api/github';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
	searching: boolean;
	searchResults: Repository[];
};

export function SearchResults({ searching, searchResults }: Props) {
	if (searching) {
		return <h2 className="text-xl font-medium absolute xl:top-24">Searching...</h2>;
	}
	if (searchResults.length === 0) {
		return (
			<>
				<Image
					alt="Mona looking through a globe hologram for code"
					height={310}
					src="/assets/images/Mona-searching.png"
					width={500}
				/>
				<h2 className="text-xl font-medium">Your search did not match any repositories</h2>
			</>
		);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Stars</TableHead>
					<TableHead>Forks</TableHead>
					<TableHead>Language</TableHead>
					<TableHead>Description</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody className="h-1">
				{searchResults.map(({ description, forks_count, id, full_name, languages, stargazers_count }) => (
					<TableRow className="h-full" key={id}>
						<TableCell className="h-full p-0.5 pl-2">
							<a
								className="text-blue-logo flex h-full items-center underline underline-offset-4"
								href={`https://github.com/${full_name}`}
								target="_blank"
								title={`Visit ${full_name} on GitHub`}
							>
								{full_name}
							</a>
						</TableCell>
						<TableCell>{stargazers_count}</TableCell>
						<TableCell>{forks_count}</TableCell>
						<TableCell>{Object.keys(languages).join(', ')}</TableCell>
						<TableCell>{description}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
