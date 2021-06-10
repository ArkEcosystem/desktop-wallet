import tw, { css } from "twin.macro";

export const defaultStyle = css`
	z-index: 10;

	.PluginManagerNavigationBar__item {
		${tw`relative flex items-center h-full font-semibold transition-colors duration-200 text-base text-theme-secondary-text hover:text-theme-text focus:outline-none border-t-2 border-b-2 border-transparent`}

		&:hover, &.active {
			border-bottom-color: var(--theme-color-primary-600);
			color: var(--theme-text-color);
		}
	}
`;
