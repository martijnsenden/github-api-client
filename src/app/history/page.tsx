'use client';

import Link from 'next/link';
import React, { useState } from 'react';

import { SearchQuery } from '@/app/search/page';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

const Page = () => {
	const [searchQueryHistory, setSearchQueryHistory] = useState(
		typeof window !== 'undefined'
			? (JSON.parse(sessionStorage.getItem('searchQueryHistory') || '[]') as SearchQuery[])
			: ([] as SearchQuery[])
	);

	function handleSearchQueryHistoryItemClick(i: number) {
		const newSearchQueryHistory = JSON.stringify([searchQueryHistory[i], ...searchQueryHistory]);

		if (typeof window !== 'undefined') {
			sessionStorage.setItem('searchQueryHistory', newSearchQueryHistory);
		}

		return true;
	}

	function handleClearHistory() {
		sessionStorage.setItem('searchQueryHistory', '[]');
		setSearchQueryHistory([]);
	}

	return (
		<>
			<Header />
			<section>
				{searchQueryHistory.length > 0 ? (
					<Button className="bg-blue-buttons" onClick={handleClearHistory}>
						Clear history
					</Button>
				) : (
					<h2 className="font-medium text-lg">There are no previous searches yet.</h2>
				)}
				<ol>
					{searchQueryHistory.map(({ searchTerm, filters: { forks, language, stars }, sortBy }, i) => {
						return (
							<li key={i}>
								<Link
									className="text-blue-logo flex h-full items-center mb-6 underline underline-offset-4"
									href="/search"
									onClick={() => handleSearchQueryHistoryItemClick(i)}
									title="Search again with this search term, these filters and this sorting"
								>
									{`Search term: "${searchTerm}"`}
									{forks > 0 && `, with at least ${forks} forks`}
									{language && `, containing code written in ${language}`}
									{stars > 0 && `, with at least ${stars} stars`}
									{sortBy && `, with results sorted by ${sortBy}`}
								</Link>
							</li>
						);
					})}
				</ol>
			</section>
		</>
	);
};

export default Page;
