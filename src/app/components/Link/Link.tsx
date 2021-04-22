import { Tooltip } from "app/components/Tooltip";
import { toasts } from "app/services";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { openExternal } from "utils/electron-utils";

import { Icon } from "../Icon";

const AnchorStyled = styled.a<{ isExternal: boolean }>`
	${css`
		&:hover,
		&:active {
			${tw`no-underline`}
		}
	`}
`;

type AnchorProps = {
	isExternal?: boolean;
	navigate?: () => void;
	showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
	({ isExternal, showExternalIcon, children, rel, ...props }: AnchorProps, ref) => (
		<AnchorStyled
			data-testid="Link"
			isExternal={isExternal!}
			className="pointer-events-none no-underline inline-flex items-center font-semibold transition-colors duration-200 cursor-pointer text-theme-primary-600 hover:text-theme-primary-700 hover:underline active:text-theme-primary-500"
			rel={isExternal ? "noopener noreferrer" : rel}
			ref={ref}
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
				return props.navigate?.();
			}}
			{...props}
		>
			<span className="group">
				<span
					className={cn("no-underline break-all pointer-events-auto", {
						"border-b group-hover:border-0 active:border-0 border-dotted": isExternal,
						"hover:border-b": !isExternal,
					})}
				>
					{children}
				</span>
				{isExternal && showExternalIcon && (
					<Icon
						data-testid="Link__external"
						name="Redirect"
						className={cn("flex-shrink-0 pointer-events-auto", { "inline-block pl-2 text-sm": children })}
					/>
				)}
			</span>
		</AnchorStyled>
	),
);

Anchor.displayName = "Anchor";

type Props = {
	isExternal?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
	showExternalIcon?: boolean;
} & Omit<LinkProps, "referrerPolicy">;

export const Link = ({ tooltip, ...props }: Props) => {
	const { t } = useTranslation();

	return (
		<Tooltip content={tooltip} disabled={!tooltip}>
			{props.isExternal ? (
				<Anchor
					onClick={(event) => {
						event.stopPropagation();
						event.preventDefault();
						try {
							openExternal(props.to);
						} catch {
							toasts.error(t("COMMON.ERRORS.INVALID_URL", { url: props.to }));
						}
					}}
					{...props}
				/>
			) : (
				<RouterLink component={Anchor} {...props} />
			)}
		</Tooltip>
	);
};

Link.defaultProps = {
	isExternal: false,
	showExternalIcon: true,
};
