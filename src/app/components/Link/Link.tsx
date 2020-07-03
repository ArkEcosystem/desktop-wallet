import Tippy from "@tippyjs/react";
import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { styled } from "twin.macro";

import { Icon } from "../Icon";

const AnchorStyled = styled.a<{ isExternal: boolean }>`
	${({ isExternal }) =>
		isExternal &&
		`
		text-decoration: underline;
		text-decoration-style: dotted;
		&:active {
			text-decoration-style: dotted;
		}
		&:hover:not(:active) {
			text-decoration: none;
		}
	`}
`;

type AnchorProps = {
	isExternal?: boolean;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
	({ isExternal, children, target, rel, ...props }: AnchorProps, ref) => {
		return (
			<AnchorStyled
				data-testid="Link"
				isExternal={isExternal!}
				className="transition-colors duration-200 text-theme-primary font-semibold cursor-pointer inline-flex items-center hover:text-theme-primary-dark hover:underline active:text-theme-primary-500"
				target={isExternal ? "_blank" : target}
				rel={isExternal ? "noopener noreferrer" : rel}
				ref={ref}
				{...props}
			>
				{children}
				{isExternal && (
					<Icon
						data-testid="Link__external"
						name="Redirect"
						className={`flex-shrink-0 ${children ? "ml-2 text-sm" : ""}`}
					/>
				)}
			</AnchorStyled>
		);
	},
);

Anchor.displayName = "Anchor";

type Props = {
	isExternal?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
} & LinkProps;

export const Link = ({ tooltip, ...props }: Props) => {
	return (
		<Tippy content={tooltip} disabled={!tooltip}>
			<RouterLink component={Anchor} {...props} />
		</Tippy>
	);
};

Link.defaultProps = {
	isExternal: false,
};
