import tw, { css } from "twin.macro";

export const PaginationSearchWrapper = css`
	.search-form {
		${tw`px-2 flex absolute inset-0 z-10 rounded bg-theme-primary-100 dark:bg-theme-secondary-800`}
	}

	.search-control {
		${tw`pr-2 pl-2 py-2 text-theme-secondary-500 hover:text-theme-primary-600 dark:text-theme-secondary-200`}
	}
`;

export const SearchInput = css`
	& {
		${tw`p-2 w-full bg-transparent dark:text-theme-secondary-200 border-0`}

		appearance: none !important;
		-moz-appearance: none !important;
		-webkit-appearance: none !important;
		box-shadow: none !important;

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			${tw`hidden pointer-events-none`}
		}
	}
`;

export const PaginationSearchToggleButton = css`
	${tw`relative text-theme-primary-600 p-2 cursor-pointer flex flex-nowrap items-center dark:text-theme-secondary-200`}

	&:hover {
		${tw`bg-theme-primary-600 text-white rounded`}
		box-shadow: 2px 3px 10px 2px rgba(var(--theme-color-primary-rgb), 0.2);
		transform: scale(1.1);
	}

	&:focus {
		${tw`rounded outline-none ring-2 ring-theme-primary-400`}
	}
`;

export const PaginationButton = css`
	${tw`text-theme-primary-600 dark:text-theme-secondary-200 cursor-pointer px-2 text-base inline-flex items-center font-semibold text-center transition-all duration-100 ease-linear justify-center`}

	&:not(:disabled):hover {
		${tw`bg-theme-primary-600 text-white rounded`}
		box-shadow: 2px 3px 10px 2px rgba(var(--theme-color-primary-rgb), 0.2);
		transform: scale(1.1);
	}

	&.current-page {
		${tw`bg-theme-primary-500 dark:bg-theme-secondary-600 text-white dark:text-theme-secondary-200`}
	}

	&:focus {
		${tw`rounded outline-none ring-2 ring-theme-primary-400`}
	}
`;

export const PaginationWrapper = css`
	${tw`flex space-x-3 h-10`}

	button:first-child,button:last-child {
		${tw``}
	}

	& > button {
		${tw`py-2 px-4`}
	}
`;
