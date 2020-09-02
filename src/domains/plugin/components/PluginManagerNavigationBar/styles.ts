export const defaultStyle = `
    z-index: 10;

	.PluginManagerNavigationBar__item {
        border-bottom: 3px solid transparent;
        &.active {
            border-bottom-color: var(--theme-color-primary-dark);
            color: var(--theme-color-neutral-900);
        }

	}

	li:first-child {
	   a {
		   padding-left: 0;
	   }
    }
`;
