import { Tooltip } from "app/components/Tooltip";
import { toasts } from "app/services";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import tw, { styled } from "twin.macro";
import { openExternal } from "utils/electron-utils";

import { Icon } from "../Icon";

const AnchorStyled = styled.a(() => [
	tw`relative inline-block space-x-2 font-semibold text-theme-primary-600`,
	tw`transition-colors duration-200`,
	tw`cursor-pointer no-underline`,
	tw`hover:text-theme-primary-700`,
	tw`active:text-theme-primary-500`,
	tw`focus:(outline-none after:ring-2)`,
	tw`after:(content absolute inset-0 -m-1 ring-theme-primary-400 rounded)`,
]);

type AnchorProps = {
	isExternal?: boolean;
	navigate?: () => void;
	showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
	({ isExternal, showExternalIcon, href, children, rel, ...props }: AnchorProps, ref) => (
		<AnchorStyled
			className="group"
			data-testid="Link"
			rel={isExternal ? "noopener noreferrer" : rel}
			ref={ref}
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
				return props.navigate?.();
			}}
			href={href || "#"}
			{...props}
		>
			<span
				className={cn("break-all border-b border-transparent transition-colors duration-200", {
					"border-current border-dotted group-hover:border-transparent": isExternal,
					"group-hover:border-current": !isExternal,
				})}
			>
				{children}
			</span>
			{isExternal && showExternalIcon && (
				<span className="align-middle">
					<Icon
						data-testid="Link__external"
						name="Redirect"
						className={cn("flex-shrink-0", { "inline-block pb-px text-sm": children })}
					/>
				</span>
			)}
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
