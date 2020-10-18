import tw, { styled } from "twin.macro";

export const SelectAddressWrapper = styled.button`
	& {
		min-height: 50px;
		${tw`text-left w-full inline-block bg-theme-background appearance-none relative flex items-center rounded border transition-colors duration-200 outline-none text-theme-neutral`}
		${tw`border-theme-neutral-300 dark:border-theme-neutral-800`}
	}

	&.is-disabled {
		${tw`border-theme-neutral-300 dark:border-theme-neutral-800 bg-theme-neutral-contrast text-theme-secondary-text`}
	}

	&.is-invalid {
		${tw`border-theme-danger`}
	}
`;
