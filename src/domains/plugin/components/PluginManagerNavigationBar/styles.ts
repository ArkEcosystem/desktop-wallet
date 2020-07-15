export const defaultStyle = `
    z-index: 10;

	.PluginManagerNavigationBar__item {
        border-bottom: 0.25rem solid transparent;
        &.active {
            border-bottom: 0.25rem solid var(--theme-color-primary-500);
            color: var(--theme-neutral-contrast);
        }

	}

	li:first-child {
	   a {
		   padding-left: 0;
	   }
    }
`;
