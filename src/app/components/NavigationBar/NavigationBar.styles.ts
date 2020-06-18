export const defaultStyle = `
    z-index: 1000;

    li a {
        border-bottom: 2px solid transparent;
        &.active {
            border-bottom: 2px solid var(--theme-color-primary-700);
            color: var(--theme-neutral-neutral-100);
        }
    } 
`;
