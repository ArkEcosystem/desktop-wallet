import Tippy from "@tippyjs/react";
import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { styled } from "twin.macro";
import { openExternal } from "utils/electron-utils";

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
	navigate?: () => void;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
	({ isExternal, children, rel, ...props }: AnchorProps, ref) => (
		<AnchorStyled
			data-testid="Link"
			isExternal={isExternal!}
			className="inline-flex items-center font-semibold cursor-pointer transition-colors duration-200 text-theme-primary hover:text-theme-primary-dark hover:underline active:text-theme-primary-500"
			rel={isExternal ? "noopener noreferrer" : rel}
			ref={ref}
			onClick={(event) => {
				event.preventDefault();
				return props.navigate?.();
			}}
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
	),
);

Anchor.displayName = "Anchor";

type Props = {
	isExternal?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
} & LinkProps;

export const Link = ({ tooltip, ...props }: Props) => (
	<Tippy content={tooltip} disabled={!tooltip}>
		{props.isExternal ? (
			<Anchor
				onClick={(event) => {
					event.preventDefault();
					return openExternal(props.to);
				}}
				{...props}
			/>
		) : (
			<RouterLink component={Anchor} {...props} />
		)}
	</Tippy>
);

Link.defaultProps = {
	isExternal: false,
};
