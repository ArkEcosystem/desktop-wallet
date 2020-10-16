import tw, { styled } from "twin.macro";

export const SelectToggleButton = styled.button`
	& {
		min-height: 50px;
		${tw`outline-none text-left w-full inline-block bg-theme-background appearance-none rounded border py-3 px-4 transition-colors duration-200 outline-none text-theme-neutral pr-12`}
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
		${tw`text-theme-text`}
	}
`;

export const SelectOptionsList = styled.ul`
	& {
		${tw`absolute w-full z-10 top-14 rounded-lg shadow-xl bg-white outline-none`}
	}

	&.is-open {
		${tw`py-6 max-h-128 overflow-y-auto`}
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
			${tw`bg-theme-neutral-contrast -mt-px`};
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
