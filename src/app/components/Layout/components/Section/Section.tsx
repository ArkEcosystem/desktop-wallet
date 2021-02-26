import React from "react";
import tw, { css, styled } from "twin.macro";

type SectionProps = {
	children: React.ReactNode;
	backgroundColor?: string;
	className?: string;
	innerClassName?: string;
};

const SectionWrapper = styled.div<{ backgroundColor?: string }>`
	${tw`w-full`}
	${({ backgroundColor }) =>
		css`
			& {
				background-color var(${backgroundColor});
			}
		`};
`;

export const Section = ({ children, backgroundColor, className, innerClassName }: SectionProps) => (
	<SectionWrapper backgroundColor={backgroundColor} className={className}>
		<div className={`container py-16 px-14 mx-auto ${innerClassName || ""}`}>{children}</div>
	</SectionWrapper>
);
