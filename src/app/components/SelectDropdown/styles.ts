import tw, { styled } from "twin.macro";

export const SelectToggleButton = styled.button`
	& {
		min-height: 50px;
		${tw`text-left shadow-sm w-full inline-block bg-theme-background appearance-none rounded border py-3 px-4 transition-colors duration-200 outline-none text-theme-neutral-500 pr-12`}
		${tw`border-theme-neutral-300`}
	}

	&:disabled {
		${tw`border-theme-neutral-300 bg-theme-neutral-contrast text-theme-neutral-dark`}
	}

	&.is-open {
		${tw`border-theme-primary`}
	}

	&.is-invalid {
		${tw`border-theme-danger`}
	}

	&.is-selected {
		${tw`text-theme-neutral-900`}
	}
`;

export const SelectOptionsList = styled.ul`
	& {
		${tw`absolute w-full z-10 top-14 rounded-lg shadow-xl bg-white outline-none`}
	}

	&.is-open {
		${tw`py-6`}
	}

	.select-list-option {
		${tw`px-10`};

		&__label {
			${tw`py-4 `};
		}

		&:not(:last-child) {
			.select-list-option__label {
				${tw`border-b border-theme-neutral-300`};
			}
		}

		&.is-highlighted {
			${tw`bg-theme-neutral-100 -mt-px pt-px`};
			.select-list-option__label {
				${tw`border-b border-theme-neutral-100`};
			}
		}
	}
`;
