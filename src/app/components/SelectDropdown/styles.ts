import tw, { styled } from "twin.macro";

export const SelectToggleButton = styled.button`
	& {
		min-height: 50px;
		${tw`inline-block w-full px-4 py-3 pr-12 text-left transition-background duration-200 border rounded outline-none appearance-none bg-theme-background text-theme-secondary-500`}
		${tw`border-theme-secondary-300 dark:border-theme-secondary-800`}
	}

	&:focus {
		${tw`outline-none`}
	}

	&:disabled {
		${tw`border-theme-secondary-300 dark:border-theme-secondary-800 bg-theme-secondary-100 text-theme-secondary-text`}
	}

	&.is-open {
		${tw`border-theme-primary-600`}
		box-shadow: 0 0 0 1px var(--theme-color-primary-600);
	}

	&.is-invalid {
		${tw`border-theme-danger-500`}
		&.is-open {
			box-shadow: 0 0 0 1px var(--theme-color-danger-500);
		}
	}

	&.is-selected {
		${tw`text-theme-text`}
	}
`;

export const SelectOptionsList = styled.ul`
	& {
		${tw`absolute z-10 w-full bg-theme-background rounded-lg shadow-xl outline-none top-14`}
	}

	&.is-open {
		${tw`py-6 overflow-y-auto max-h-64`}
	}

	.select-list-option {
		${tw`px-10 border-0 text-theme-secondary-800 dark:text-theme-secondary-200 cursor-pointer transition`};

		&__label {
			${tw`py-4 `};
		}

		&:not(:last-child) {
			.select-list-option__label {
				${tw`border-b border-theme-secondary-300 dark:border-theme-secondary-800`};
			}
		}

		&:hover,
		&.is-highlighted {
			padding-top: 1px;

			&:last-child {
				${tw`-mb-px`};
			}
		}

		&.is-highlighted {
			${tw`-mt-px bg-theme-danger-100 dark:bg-theme-danger-400 text-theme-danger-400 dark:text-white`};

			.select-list-option__label {
				${tw`border-b border-theme-danger-100 dark:border-theme-danger-400`};
			}
		}

		&:hover {
			${tw`-mt-px bg-theme-secondary-200 dark:bg-theme-primary-600 text-theme-primary-600 dark:text-theme-secondary-200`};

			.select-list-option__label {
				${tw`border-b border-transparent`};
			}
		}

		&.is-empty {
			&:hover {
				${tw`bg-theme-background cursor-default`}
			}
		}
	}
`;
