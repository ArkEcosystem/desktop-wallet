export const defaultStyle = `
    z-index: 10;

	.PluginManagerNavigationBar__item {
        border-bottom: 2px solid transparent;
        &.active {
            border-bottom: 2px solid var(--theme-color-primary-dark);
            color: var(--theme-neutral-contrast);
        }

	}

	li:first-child {
	   a {
		   padding-left: 0;
	   }
    }
`;
