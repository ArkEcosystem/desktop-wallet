import tw, { styled } from "twin.macro";

export const LogoSpinner = styled.div`
	& {
		${tw`relative z-30`}
		width: 7rem;
		height: 7rem;

		.centered {
			${tw`flex items-center justify-center absolute top-0 right-0 left-0 bottom-0`}
		}

		.spin {
			animation: spin 0.8s ease-out infinite;
			&.left {
				animation: spin-left 1s ease-in infinite;
			}
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes spin-left {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(-360deg);
			}
		}
	}
`;

export const LoaderWrapper = styled.div`
	${tw`absolute flex items-center justify-center top-0 right-0 left-0 bottom-0`}
`;
