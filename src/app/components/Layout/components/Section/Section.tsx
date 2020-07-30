import React from "react";
import tw, { styled } from "twin.macro";

type SectionProps = {
	children: React.ReactNode;
	hasBackground?: boolean;
	className?: string;
};

const SectionWrapper = styled.div(({ hasBackground }: SectionProps) => [
	tw`w-full`,
	hasBackground && tw`bg-theme-background`,
]);

export const Section = ({ children, hasBackground, className }: SectionProps) => (
	<SectionWrapper hasBackground={hasBackground} className={className}>
		<div className="container py-16 mx-auto px-14">{children}</div>
	</SectionWrapper>
);

Section.defaultProps = {
	hasBackground: true,
};
