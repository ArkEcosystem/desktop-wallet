import { styled } from "twin.macro";

const defaultStyle = `
	& {
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

const questionMarkStyle = `
	& {
		.questionmark {
			svg {
				fill: var(--theme-color-primary-100);
			}
			&:hover svg {
				fill: var(--theme-color-primary-600);
			}
		}
	}
`;

export const AddRecipientWrapper = styled.div`
	${defaultStyle}
	${questionMarkStyle}
`;
