import { styled } from "twin.macro";

const defaultStyle = `
	& {
		.select-buttons {
			div:first-child button {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			div:last-child button {
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
