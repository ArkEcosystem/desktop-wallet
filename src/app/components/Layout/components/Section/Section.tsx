import React from "react";
import tw, { css, styled } from "twin.macro";

type SectionProps = {
	children: React.ReactNode;
	hasBackground?: boolean;
	marginTop?: boolean;
	className?: string;
};

const SectionWrapper = styled.div(({ hasBackground, marginTop }: SectionProps) => [
	css`
		&:first-child {
			margin-top: 0;
		}
	`,
	tw`w-full`,
	hasBackground && tw`bg-theme-background`,
	marginTop && tw`mt-5`,
]);

export const Section = ({ children, hasBackground, marginTop, className }: SectionProps) => (
	<SectionWrapper hasBackground={hasBackground} marginTop={marginTop} className={className}>
		<div className="container py-16 mx-auto px-14">{children}</div>
	</SectionWrapper>
);

Section.defaultProps = {
	hasBackground: true,
	marginTop: true,
};
