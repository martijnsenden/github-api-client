'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { getSearchResults, Repository, SearchFilters, SearchSortBy } from '@/api/github';
import { SearchResults } from '@/app/search/SearchResults';
import { Dropdown } from '@/components/Dropdown';
import { NavigationMenu } from '@/components/NavigationMenu';

// This css file and the import are needed because of an issue with Radix theming that is not yet resolved
// See https://github.com/radix-ui/themes/issues/59
import '../theme.css';

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
			<NavigationMenu />
			<section>
				<fieldset>
					<label>
						Search Github for repositories:
						<input onKeyUp={handleNewSearchQuery} ref={searchQueryInputRef} type="text" />
					</label>
					<button onClick={handleSearchButtonClick}>Search</button>
				</fieldset>
				<fieldset>
					<Dropdown
						items={getFilterByCountOptions('forks')}
						label="Forks"
						onChange={(selectedValue) => storeFilters('forks', parseInt(selectedValue))}
						value={filters.forks}
					/>
					<Dropdown
						items={getFilterByCountOptions('stars')}
						label="Stars"
						onChange={(selectedValue) => storeFilters('stars', parseInt(selectedValue))}
						value={filters.stars}
					/>
					<label>
						Language
						<input onKeyUp={handleLanguageFilterChange} ref={languageFilterInputRef} type="text" />
					</label>
				</fieldset>
				{/*<RadioGroup.Root*/}
				{/*	defaultValue="default"*/}
				{/*	aria-label="Select the field to sort the search results by"*/}
				{/*	onValueChange={(value: string) => storeSortBy(value as SearchSortBy)}*/}
				{/*	variant="classic"*/}
				{/*>*/}
				{/*	<Flex gap="2" direction="row">*/}
				{/*		<div style={{ display: 'flex', alignItems: 'center' }}>*/}
				{/*			<RadioGroup.Item value="default" id="r1" />*/}
				{/*			<label htmlFor="r1">Default sorting</label>*/}
				{/*		</div>*/}
				{/*		<div style={{ display: 'flex', alignItems: 'center' }}>*/}
				{/*			<RadioGroup.Item value="stars" id="r2" />*/}
				{/*			<label htmlFor="r2">By stars</label>*/}
				{/*		</div>*/}
				{/*		<div style={{ display: 'flex', alignItems: 'center' }}>*/}
				{/*			<RadioGroup.Item value="forks" id="r3" />*/}
				{/*			<label htmlFor="r3">By forks</label>*/}
				{/*		</div>*/}
				{/*	</Flex>*/}
				{/*</RadioGroup.Root>*/}
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
