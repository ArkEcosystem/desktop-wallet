import tw, { css, styled } from "twin.macro";

const minWidth = css`
	min-width: 12rem;
`;

const defaultClasses = tw`mt-8 py-3 absolute right-0 z-10 bg-theme-background rounded-lg shadow-xl border-theme-neutral-100 border-1`;

export const Wrapper = styled.div`
	${minWidth}
	${defaultClasses}
`;
