import React from 'react';

import { Repository } from '@/api/github';
import Image from 'next/image';
import { fork } from 'child_process';

type Props = {
	noSearchText: boolean;
	searching: boolean;
	searchResults: Repository[];
};

export function SearchResults({ noSearchText, searching, searchResults }: Props) {
	if (searching) {
		return <h2>Searching...</h2>;
	}
	if (noSearchText) {
		return <h2>Search through the public github repos</h2>;
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
				<h2>Your search did not match any repositories</h2>
			</>
		);
	}
	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Stars</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Forks</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Language</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{searchResults.map(({ description, forks_count, id, full_name, languages, stargazers_count }) => (
					<Table.Row key={id}>
						<Table.RowHeaderCell>{full_name}</Table.RowHeaderCell>
						<Table.Cell>{stargazers_count}</Table.Cell>
						<Table.Cell>{forks_count}</Table.Cell>
						<Table.Cell>{Object.keys(languages).join(', ')}</Table.Cell>
						<Table.Cell>{description}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
}
