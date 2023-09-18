'use client';

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { getSearchResults, Repository, SearchFilters, SearchSortBy } from '@/api/github';
import { SearchResults } from '@/app/search/SearchResults';
import { Dropdown } from '@/components/Dropdown';
import { Header } from '@/components/Header';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import SearchIcon from '/public/assets/images/magnifying-glass.svg';

export type SearchQuery = {
	searchText: string;
	filters: SearchFilters;
	sortBy: SearchSortBy;
};

const Page = () => {
	let searchQueryHistoryFromSessionStorage = [];

	if (typeof window !== 'undefined') {
		searchQueryHistoryFromSessionStorage = JSON.parse(sessionStorage.getItem('searchQueryHistory') || '[]');
	}

	const lastSearchQueryHistoryItemFromSessionStorage =
		searchQueryHistoryFromSessionStorage.length > 0
			? searchQueryHistoryFromSessionStorage[0]
			: { searchText: '', filters: { forks: 0, stars: 0, language: '' }, sortBy: undefined };
	const [filters, setFilters] = useState<SearchFilters>(
		lastSearchQueryHistoryItemFromSessionStorage.filters
	);
	const [sortBy, setSortBy] = useState<SearchSortBy>(lastSearchQueryHistoryItemFromSessionStorage.sortBy);
	const [searchQueryHistory, setSearchQueryHistory] = useState<SearchQuery[]>(
		searchQueryHistoryFromSessionStorage
	);
	const [searchResults, setSearchResults] = useState<Repository[]>([]);
	const [searching, setSearching] = useState<boolean>(false);

	const searchQueryInputRef = useRef<HTMLInputElement>(null);
	const languageFilterInputRef = useRef<HTMLInputElement>(null);

	async function handleSearch() {
		setSearching(true);

		try {
			const results = await getSearchResults(searchQueryInputRef?.current?.value || '', filters, sortBy);
			setSearchResults(results);
		} catch (error) {
			console.error('', error);
		}

		setSearching(false);
	}

	// Initialize the form with the last search query that was stored if available.
	useEffect(() => {
		if (lastSearchQueryHistoryItemFromSessionStorage.searchText && searchQueryInputRef.current) {
			searchQueryInputRef.current.value = lastSearchQueryHistoryItemFromSessionStorage.searchText;
		}

		if (lastSearchQueryHistoryItemFromSessionStorage.sortBy) {
			setSortBy(sortBy);
		}

		if (lastSearchQueryHistoryItemFromSessionStorage.filters) {
			setFilters(filters);

			if (languageFilterInputRef.current) {
				languageFilterInputRef.current.value =
					lastSearchQueryHistoryItemFromSessionStorage.filters.language;
			}
		}

		// Only run this useEffect hook once, by using an empty dependency array
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Execute a search if a search query is available
		if (searchQueryInputRef?.current?.value) {
			handleSearch();
		}
		// We only want a new search to be executed each time sortBy , filters or the searchQueryHistory array
		// changes, so we leave any other potential dependencies out of the dependency array and suppress the
		// eslint warning for the left-out dependencies.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQueryHistory, filters, sortBy]);

	const unshiftIntoSearchQueryHistory = (searchQuery: SearchQuery) => {
		const newSearchQueryHistory = [searchQuery, ...searchQueryHistory];
		setSearchQueryHistory(newSearchQueryHistory);
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('searchQueryHistory', JSON.stringify(newSearchQueryHistory));
		}
	};

	const handleNewSearchQuery = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && searchQueryInputRef.current) {
			unshiftIntoSearchQueryHistory({ searchText: searchQueryInputRef.current.value, filters, sortBy });
		}
	};

	const handleSearchButtonClick = () => {
		if (
			searchQueryHistory.length > 0 &&
			searchQueryInputRef?.current?.value !==
				searchQueryHistory[searchQueryHistory.length - 1].searchText &&
			searchQueryInputRef.current
		) {
			unshiftIntoSearchQueryHistory({ searchText: searchQueryInputRef.current.value, filters, sortBy });
		}
	};

	const handleLanguageFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && languageFilterInputRef.current) {
			storeFilters('language', languageFilterInputRef.current.value);
		}
	};

	return (
		<>
			<Header />
			<section>
				<fieldset>
					<label className="w-1/2 flex justify-start items-center relative text-gray-placeholders">
						<input
							className="border text-black border-gray-borders rounded-lg p-4 pl-12 w-full"
							onKeyUp={handleNewSearchQuery}
							placeholder="Search GitHub for repositories"
							ref={searchQueryInputRef}
							type="text"
						/>
						<SearchIcon className="absolute ml-4 w-[1.5em] h-auto text-gray-placeholders" />
					</label>
					<Button className="bg-blue-buttons" onClick={handleSearchButtonClick}>
						Search
					</Button>
				</fieldset>
				<fieldset className="justify-start table">
					<div className="flex flex-row items-center">
						<legend>Filter by</legend>
						<Dropdown
							items={getFilterByCountOptions('forks')}
							listLabel="Forks count"
							onChange={(selectedValue) => storeFilters('forks', parseInt(selectedValue))}
							selectLabel="forks"
							value={filters.forks}
							width="w-[130px]"
						/>
						<Dropdown
							items={getFilterByCountOptions('stars')}
							listLabel="Stars count"
							onChange={(selectedValue) => storeFilters('stars', parseInt(selectedValue))}
							selectLabel="stars"
							value={filters.stars}
							width="w-[130px]"
						/>
						<label>
							Language
							<input onKeyUp={handleLanguageFilterChange} ref={languageFilterInputRef} type="text" />
						</label>
					</div>
				</fieldset>
				<RadioGroup
					defaultValue="default"
					aria-label="Select the field to sort the search results by"
					onValueChange={(value: string) => storeSortBy(value as SearchSortBy)}
				>
					<fieldset className="flex flex-row gap-2">
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<RadioGroupItem value="default" id="r1" />
							<label htmlFor="r1">Default sorting</label>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<RadioGroupItem value="stars" id="r2" />
							<label htmlFor="r2">By stars</label>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<RadioGroupItem value="forks" id="r3" />
							<label htmlFor="r3">By forks</label>
						</div>
					</fieldset>
				</RadioGroup>
				<section>
					<SearchResults
						noSearchText={!searchQueryInputRef?.current?.value}
						searching={searching}
						searchResults={searchResults}
					/>
				</section>
			</section>
		</>
	);

	function getFilterByCountOptions(filter: keyof SearchFilters) {
		return [
			{ description: `no ${filter} filter`, value: '0' },
			{ description: '>=10', value: '10' },
			{ description: '>=100', value: '100' },
			{ description: '>=1000', value: '1000' },
			{ description: '>=10000', value: '10000' },
		];
	}

	function storeFilters(type: keyof SearchFilters, value: number | string) {
		const newFilters = { ...filters, [type]: value };
		setFilters(newFilters);

		if (searchQueryInputRef.current?.value) {
			unshiftIntoSearchQueryHistory({
				searchText: searchQueryInputRef.current.value,
				filters: newFilters,
				sortBy,
			});
		}
	}

	function storeSortBy(type: SearchSortBy) {
		// Sort searchResults by stars
		setSortBy(type);

		if (searchQueryInputRef.current?.value) {
			unshiftIntoSearchQueryHistory({
				searchText: searchQueryInputRef.current.value,
				filters,
				sortBy: type,
			});
		}
	}
};

export default Page;
