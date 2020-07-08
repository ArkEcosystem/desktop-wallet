export const defaultStyle = `
    z-index: 10;

	.PluginManagerNavigationBar__item {
        border-bottom: 2px solid transparent;
        &.active {
            border-bottom: 2px solid var(--theme-color-primary-700);
            color: var(--theme-neutral-neutral-100);
        }

	}

	li:last-child {
	   .PluginManagerNavigationBar__menu-divider {
		   display: none;
	   }
    }

	li:first-child {
	   a {
		   padding-left: 0;
	   }
    }
`;
