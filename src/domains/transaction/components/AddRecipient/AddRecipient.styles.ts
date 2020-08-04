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

export const AddRecipientWrapper = styled.div`
	${defaultStyle}
`;
