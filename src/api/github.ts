import { Octokit } from '@octokit/core';
import { Endpoints, RequestError } from '@octokit/types';

// Define the shape of the search filters
export interface SearchFilters {
	forks: number;
	language: string;
	stars: number;
}

export type SearchSortBy = undefined | 'forks' | 'stars';

type Unpacked<T> = T extends (infer U)[] ? U : T;

type ApiRepository = Unpacked<Endpoints['GET /search/repositories']['response']['data']['items']>;
export type Repository = ApiRepository & {
	languages: Record<string, number>;
};

// Function to fetch search results from the GitHub API
export async function getSearchResults(
	searchText: string,
	{ forks, language, stars }: SearchFilters,
	sortBy: SearchSortBy
): Promise<Repository[]> {
	try {
		// Create the query and add the sort queries
		const query = `"${searchText}"+in:name+in:description+in:topics+in:readme${
			forks ? `+forks:>=${forks}` : ''
		}${stars ? `+stars:>=${stars}` : ''}${language ? `+language:${language}` : ''}`;
		// Make an HTTP GET request to the GitHub API search endpoint
		const octokit = new Octokit({ auth: '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' });
		const response = await octokit.request('GET /search/repositories', {
			q: query,
			sort: sortBy,
			order: 'desc',
			per_page: 10,
		});

		return await Promise.all(
			response.data.items.map(async (repo: ApiRepository) => {
				return {
					...repo,
					languages: (await octokit.request(`GET ${repo.languages_url}`)).data as unknown as Record<
						string,
						number
					>,
				};
			})
		);
	} catch (error) {
		// Handle any errors that occur during the API request
		handleRequestError(error);
		// Re-throw the error to be caught by the caller
		throw error;
	}
}

// Function to handle errors that occur during the API request
function handleRequestError(error: unknown) {
	// The check for a status adn documentation_url in error, allows TypeScript
	// to recognize the error as an Octokit RequestError, and so it can access
	// the properties of RequestError without any type errors.
	if (error instanceof Error && 'status' in error && 'documentation_url' in error) {
		// If the error has a status, it is an Octokit RequestError. Handle specific Octokit Request errors or perform custom error handling.
		const { name, errors, status, documentation_url } = error as RequestError;
		console.error(
			`Octokit request error: ${name}`,
			`status: ${status}`,
			`See: ${documentation_url}`,
			'Errors:',
			errors
		);
	} else if (error instanceof Error) {
		// Handle other types of errors
		const { name, cause, message, stack } = error;
		console.error(`Request error: ${name}`, `cause: ${cause}`, `message: ${message}`, `stack: ${stack}`);
	} else {
		// Handle some other type of error
		console.error('An error occurred.', error);
	}
}
