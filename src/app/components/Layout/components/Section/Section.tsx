import cn from "classnames";
import React from "react";
import tw, { css, styled } from "twin.macro";

type SectionProps = {
	children: React.ReactNode;
	backgroundColor?: string;
	border?: boolean;
	className?: string;
	innerClassName?: string;
};

const SectionWrapper = styled.div<{ backgroundColor?: string; border?: boolean }>`
	${tw`w-full py-4 first:pt-8 last:pb-8`};

	${({ backgroundColor }) =>
		backgroundColor &&
		css`
			& {
				background-color: var(${backgroundColor});
			}
		`};

	${({ border }) =>
		border && [
			tw`border-b border-theme-secondary-300 dark:border-theme-secondary-800`,
			css`
				&.hasBorder + & {
					${tw`pt-8`}
				}
			`,
		]};

	${({ backgroundColor, border }) => (backgroundColor ? tw`py-8` : border ? tw`pb-8` : "")};
`;

export const Section = ({ children, backgroundColor, border, className, innerClassName }: SectionProps) => (
	<SectionWrapper backgroundColor={backgroundColor} border={border} className={cn(className, { hasBorder: border })}>
		<div className={cn("container px-10 mx-auto", innerClassName)}>{children}</div>
	</SectionWrapper>
);
