import { styled } from "twin.macro";

const defaultStyle = `
	& {
		.MultiRecipientWrapper {
			background: var(--theme-color-neutral-100);
			border-radius: 0.625rem;
			border: 1.5rem solid var(--theme-color-neutral-100);
			margin-left: -1.25rem;
			margin-right: -1.25rem;
		}

		.select-buttons {
			button:first-child {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			button:last-child {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
	}
`;

export const AddRecipientWrapper = styled.div`
	${defaultStyle}
`;
