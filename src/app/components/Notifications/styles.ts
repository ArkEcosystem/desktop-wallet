import tw, { css, styled } from "twin.macro";

const baseStyles = css`
	max-height: 30rem;
	${tw`overflow-y-auto p-8 py-3 w-128`};
`;
export const NotificationsWrapper = styled.div`
	${baseStyles}
`;
