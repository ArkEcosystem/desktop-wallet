import tw, { css, styled } from "twin.macro";

export const defaultStyle = `
    z-index: 40;

    li a {
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;

        &:hover, &.active {
            border-bottom-color: var(--theme-color-primary-600);
            color: var(--theme-text-color);
        }
    }
`;

export const NavWrapper = styled.nav<{ noBorder?: boolean; noShadow?: boolean; scroll?: number }>`
	${defaultStyle}

	${tw`sticky inset-x-0 top-0 transition-all duration-200 border-b border-theme-background bg-theme-background`}

	${({ noBorder, scroll }) => {
		if (!noBorder && !scroll) {
			return tw`border-theme-secondary-300 dark:border-theme-secondary-800`;
		}
	}}

	${({ noShadow, scroll }) => {
		if (!noShadow && scroll) {
			return tw`shadow-header-smooth dark:shadow-header-smooth-dark`;
		}
	}};
`;

export const NavigationButtonWrapper = styled.div`
	${css`
		button {
			${tw`w-11 h-11 overflow-hidden rounded text-theme-primary-300 dark:text-theme-secondary-600 not-disabled:(hover:text-theme-primary-700 hover:bg-theme-primary-50 dark:hover:bg-theme-secondary-800 dark:hover:text-theme-secondary-200)`};
		}
	`};
`;

export const LogoContainer = styled.div`
	${tw`flex items-center justify-center my-auto mr-4 text-white rounded w-11 h-11 bg-logo`};
`;
