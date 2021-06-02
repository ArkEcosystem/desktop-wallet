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
