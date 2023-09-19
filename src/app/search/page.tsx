'use client';

import Image from 'next/image';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { getSearchResults, Repository, SearchFilters, SearchSortBy } from '@/api/github';
import { SearchResults } from '@/app/search/SearchResults';
import { Dropdown } from '@/components/Dropdown';
import { Header } from '@/components/Header';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import SearchIcon from '/public/assets/images/magnifying-glass.svg';

export type SearchQuery = {
	searchTerm: string;
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
			: { searchTerm: '', filters: { forks: 0, stars: 0, language: '' }, sortBy: undefined };
	const [filters, setFilters] = useState<SearchFilters>(
		lastSearchQueryHistoryItemFromSessionStorage.filters
	);
	const [sortBy, setSortBy] = useState<SearchSortBy>(lastSearchQueryHistoryItemFromSessionStorage.sortBy);
	const [searchQueryHistory, setSearchQueryHistory] = useState<SearchQuery[]>(
		searchQueryHistoryFromSessionStorage
	);
	const [searchResults, setSearchResults] = useState<Repository[]>([]);
	const [searching, setSearching] = useState<boolean>(false);

	const searchTermInputRef = useRef<HTMLInputElement>(null);
	const languageFilterInputRef = useRef<HTMLInputElement>(null);

	async function handleSearch() {
		setSearching(true);

		try {
			const results = await getSearchResults(searchTermInputRef?.current?.value || '', filters, sortBy);
			setSearchResults(results);
		} catch (error) {
			console.error('', error);
		}

		setSearching(false);
	}

	// Initialize the form with the last search query that was stored if available.
	useEffect(() => {
		if (lastSearchQueryHistoryItemFromSessionStorage.searchTerm && searchTermInputRef.current) {
			searchTermInputRef.current.value = lastSearchQueryHistoryItemFromSessionStorage.searchTerm;
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
		if (searchTermInputRef?.current?.value) {
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
		if (event.key === 'Enter' && searchTermInputRef.current && shouldAddToHistory()) {
			unshiftIntoSearchQueryHistory({ searchTerm: searchTermInputRef.current.value, filters, sortBy });
		}
	};

	const handleSearchButtonClick = () => {
		if (searchTermInputRef.current && shouldAddToHistory()) {
			unshiftIntoSearchQueryHistory({ searchTerm: searchTermInputRef.current.value, filters, sortBy });
		}
	};

	const handleLanguageFilterChange = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && languageFilterInputRef.current) {
			storeFilters('language', languageFilterInputRef.current.value);
		}
	};

	const handleLanguageFilterBlur = () => {
		if (languageFilterInputRef.current) {
			storeFilters('language', languageFilterInputRef.current.value);
		}
	};

	return (
		<>
			<Header />
			<section className="max-w-3xl flex flex-col gap-6 items-center mx-auto mb-12">
				<fieldset className="my-0">
					<div className="flex gap-3 justify-items-center items-center">
						<label className="max-w-2xl grow flex justify-items-start items-center relative text-gray-placeholders">
							<input
								className="border text-black placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-md border-gray-borders rounded-lg p-4 pl-12 w-full"
								onKeyUp={handleNewSearchQuery}
								placeholder="Search GitHub for repositories"
								ref={searchTermInputRef}
								type="text"
							/>
							<SearchIcon className="absolute ml-4 w-[1.5em] h-auto text-gray-placeholders" />
						</label>
						<Button className="bg-blue-buttons" onClick={handleSearchButtonClick}>
							Search
						</Button>
					</div>
				</fieldset>
				<fieldset>
					<div className="flex flex-row flex-wrap gap-3 items-center justify-center">
						<legend className="font-bold">Filter by</legend>
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
						<label className="flex flex-row gap-3 items-center">
							Language
							<input
								className="border placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-md text-black border-gray-borders rounded-lg p-2 w-full"
								onBlur={handleLanguageFilterBlur}
								onKeyUp={handleLanguageFilterChange}
								placeholder="No language filter"
								ref={languageFilterInputRef}
								type="text"
							/>
						</label>
					</div>
				</fieldset>
				<RadioGroup
					className="grow"
					defaultValue="default"
					aria-label="Select the field to sort the search results by"
					onValueChange={(value: string) => storeSortBy(value as SearchSortBy)}
					value={sortBy}
				>
					<fieldset>
						<div className="flex flex-row flex-nowrap gap-4">
							<legend>Sorting</legend>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<RadioGroupItem value="default" id="r1" />
								<label htmlFor="r1">default</label>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<RadioGroupItem value="stars" id="r2" />
								<label htmlFor="r2">by stars</label>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<RadioGroupItem value="forks" id="r3" />
								<label htmlFor="r3">by forks</label>
							</div>
						</div>
					</fieldset>
				</RadioGroup>
			</section>
			<section className="mx-auto flex flex-col items-center gap-6 relative">
				{searchTermInputRef.current?.value && (
					<SearchResults searching={searching} searchResults={searchResults} />
				)}
				{(!searchTermInputRef.current?.value || searching) && (
					<Image
						className="-m-24"
						alt="Mona looking through binoculars at some far away place"
						height={0}
						sizes="100vw"
						src="/assets/images/Mona-searching-landscape.png"
						style={{ minWidth: '1200px', width: '100%', height: 'auto' }}
						width={0}
					/>
				)}
			</section>
		</>
	);

	function getFilterByCountOptions(filter: keyof SearchFilters) {
		return [
			{ description: `no ${filter} filter`, value: '0' },
			{ description: `>=10 ${filter}`, value: '10' },
			{ description: `>=100 ${filter}`, value: '100' },
			{ description: `>=1000 ${filter}`, value: '1000' },
			{ description: `>=10000 ${filter}`, value: '10000' },
		];
	}

	function storeFilters(type: keyof SearchFilters, value: number | string) {
		const newFilters = { ...filters, [type]: value };
		setFilters(newFilters);

		if (searchTermInputRef.current?.value) {
			unshiftIntoSearchQueryHistory({
				searchTerm: searchTermInputRef.current.value,
				filters: newFilters,
				sortBy,
			});
		}
	}

	function storeSortBy(type: SearchSortBy) {
		// Sort searchResults by stars
		setSortBy(type);

		if (searchTermInputRef.current?.value) {
			unshiftIntoSearchQueryHistory({
				searchTerm: searchTermInputRef.current.value,
				filters,
				sortBy: type,
			});
		}
	}

	function shouldAddToHistory() {
		const searchQueryHistoryIsPresent = searchQueryHistory.length !== 0;
		const eitherSearchTermOrLanguageHasChanged =
			searchTermInputRef.current &&
			searchQueryHistoryIsPresent &&
			(searchTermInputRef.current.value !== searchQueryHistory[0].searchTerm ||
				languageFilterInputRef.current?.value !== searchQueryHistory[0].filters.language);

		return !searchQueryHistoryIsPresent || eitherSearchTermOrLanguageHasChanged;
	}
};

export default Page;
