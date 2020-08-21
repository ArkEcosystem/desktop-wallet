import React from "react";
import tw, { styled } from "twin.macro";

type CardProps = {
	as?: React.ElementType;
	children: React.ReactNode;
	onClick?: any;
	className?: string;
};

const Wrapper = styled.div`
	${tw`p-6 border-2 border-theme-primary-contrast rounded-lg`}
	cursor: pointer;
`;

export const Card = ({ onClick, children, className }: CardProps) => (
	<Wrapper className={className} onClick={() => onClick?.()} data-testid="ProfileCard">
		{children}
	</Wrapper>
);
