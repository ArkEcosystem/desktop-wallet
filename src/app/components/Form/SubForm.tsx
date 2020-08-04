import React from "react";
import tw, { css, styled } from "twin.macro";

const SubFormWrapper = styled.div<{ noBackground?: boolean }>`
	${tw`space-y-8 rounded-lg p-5 -mx-5`}
	${({ noBackground }) =>
		!noBackground &&
		css`
			& {
				background-color: var(--theme-color-neutral-100);
			}
		`};
`;

export const SubForm = ({
	className,
	children,
	noBackground,
}: {
	className?: string;
	children: React.ReactNode;
	noBackground?: boolean;
}) => (
	<SubFormWrapper className={className} noBackground={!!noBackground}>
		{children}
	</SubFormWrapper>
);
