import tw, { styled } from "twin.macro";

export const SelectToggleButton = styled.button`
	& {
		min-height: 50px;
		${tw`inline-block w-full px-4 py-3 pr-12 text-left transition-colors duration-200 border rounded outline-none appearance-none bg-theme-background text-theme-neutral`}
		${tw`border-theme-neutral-300`}
	}

	&:focus {
		${tw`outline-none`}
	}

	&:disabled {
		${tw`border-theme-neutral-300 bg-theme-neutral-contrast text-theme-neutral-dark`}
	}

	&.is-open {
		${tw`border-theme-primary`}
		box-shadow: 0 0 0 1px var(--theme-color-primary);
	}

	&.is-invalid {
		${tw`border-theme-danger`}
		&.is-open {
			box-shadow: 0 0 0 1px var(--theme-color-danger);
		}
	}

	&.is-selected {
		${tw`text-theme-neutral-900`}
	}
`;

export const SelectOptionsList = styled.ul`
	& {
		${tw`absolute z-10 w-full bg-white rounded-lg shadow-xl outline-none top-14`}
	}

	&.is-open {
		${tw`py-6 overflow-y-auto max-h-128`}
	}

	.select-list-option {
		${tw`px-10 border-0`};

		&__label {
			${tw`py-4 `};
		}

		&:not(:last-child) {
			.select-list-option__label {
				${tw`border-b border-theme-neutral-300`};
			}
		}

		&.is-highlighted {
			${tw`-mt-px bg-theme-neutral-contrast`};
			padding-top: 1px;

			&:last-child {
				${tw`-mb-px`};
			}

			.select-list-option__label {
				${tw`border-b border-theme-neutral-contrast`};
			}
		}
	}
`;
