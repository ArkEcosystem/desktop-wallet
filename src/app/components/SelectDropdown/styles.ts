import tw, { styled } from "twin.macro";

export const SelectOptionsList = styled.ul`
	& {
		${tw`absolute z-10 w-full bg-theme-background rounded-lg shadow-xl outline-none top-16`}
	}

	&.is-open {
		${tw`py-6 overflow-y-auto max-h-64`}
	}

	.select-list-option {
		${tw`px-10 border-0 text-theme-secondary-900 dark:text-theme-secondary-200 cursor-pointer transition-colors duration-200`};

		&__label {
			${tw`py-4`};
		}

		&:not(:last-child) {
			.select-list-option__label {
				${tw`border-b border-theme-secondary-300 dark:border-theme-secondary-800`};
			}
		}

		&.is-highlighted,
		&.is-selected {
			${tw`-mt-px pt-px`};
		}

		&.is-highlighted {
			${tw`bg-theme-secondary-100 dark:bg-theme-primary-600`};

			.select-list-option__label {
				${tw`border-transparent`};
			}
		}

		&.is-selected {
			${tw`bg-theme-danger-100 dark:bg-theme-danger-400 text-theme-danger-400 dark:text-white`};

			.select-list-option__label {
				${tw`border-theme-danger-100 dark:border-theme-danger-400`};
			}
		}

		&.is-empty {
			${tw`cursor-default`}
		}
	}
`;
