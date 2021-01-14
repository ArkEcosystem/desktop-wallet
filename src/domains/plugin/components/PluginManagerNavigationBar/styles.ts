export const defaultStyle = `
    z-index: 10;

	.PluginManagerNavigationBar__item {
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;

        &:hover, &.active {
            border-bottom-color: var(--theme-color-primary-600);
            color: var(--theme-text-color);
        }

    }
`;
