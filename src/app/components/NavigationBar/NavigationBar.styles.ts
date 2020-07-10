export const defaultStyle = `
    z-index: 40;

    li a {
        border-bottom: 2px solid transparent;
        &.active {
            border-bottom: 2px solid var(--theme-color-primary-dark);
            color: var(--theme-neutral-neutral-contrast);
        }
    }
`;
