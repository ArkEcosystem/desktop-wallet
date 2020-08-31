export const defaultStyle = `
    z-index: 40;

    li a {
        border-bottom: 3px solid transparent;
        &.active {
            border-bottom-color: var(--theme-color-primary-dark);
            color: var(--theme-color-neutral-900);
        }
    }
`;
