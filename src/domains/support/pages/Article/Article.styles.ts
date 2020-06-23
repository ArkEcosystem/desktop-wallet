export const navStyles = `
    & {
        .active {
            position: relative;
            font-weight: bold;

            &:after {
                position: absolute;
                content: '';
                display: block;
                left: 0;
                top: 0.2rem;
                bottom: 0.2rem;
                background: var(--theme-color-primary-500);
                width: 0.2rem;
                margin-left: -0.1rem;
                border-radius: 2rem;
            }
        }
    }
`;
