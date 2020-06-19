export const defaultStyle = `
    .select-transparent {
        select {
            &:not([disabled]) {
                background-color: transparent;
                color: transparent;
            }
            option {
                color: var(--theme-color-neutral-900);
            }
        }
    }

    .send-transaction {
        &__select-contact {
            > div:first-child {
                width: 100%;
                svg {
                    display: none;
                }
            }
        }
    }
`;
