import tw, { styled } from "twin.macro";

export const SelectAddressWrapper = styled.button`
	& {
		min-height: 56px;
		${tw`text-left w-full inline-block bg-theme-background appearance-none relative flex items-center rounded border transition-colors duration-200 outline-none text-theme-secondary-500`}
		${tw`border-theme-secondary-400 dark:border-theme-secondary-700`}
	}

	&.is-disabled {
		${tw`border-theme-secondary-300 dark:border-theme-secondary-700 bg-theme-secondary-500 dark:bg-theme-secondary-800 text-theme-secondary-text`}
	}

	&.is-invalid {
		${tw`border-theme-danger-500`}
	}
`;
