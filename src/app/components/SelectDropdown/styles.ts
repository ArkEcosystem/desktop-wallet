import tw, { styled } from "twin.macro";

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

		&:hover,
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

		&.is-empty {
			&:hover {
				${tw`bg-white cursor-default`}
			}
		}
	}
`;
