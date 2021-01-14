import tw, { styled } from "twin.macro";

export const SelectAddressWrapper = styled.button`
	& {
		min-height: 50px;
		${tw`text-left w-full inline-block bg-theme-background appearance-none relative flex items-center rounded border transition-colors duration-200 outline-none text-theme-neutral-500`}
		${tw`border-theme-neutral-400 dark:border-theme-neutral-700`}
	}

	&.is-disabled {
		${tw`border-theme-neutral-300 dark:border-theme-neutral-700 bg-theme-neutral-500 dark:bg-theme-neutral-800 text-theme-secondary-text`}
	}

	&.is-invalid {
		${tw`border-theme-danger-500`}
	}
`;
