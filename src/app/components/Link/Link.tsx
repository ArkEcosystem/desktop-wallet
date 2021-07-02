import { Tooltip } from "app/components/Tooltip";
import { toasts } from "app/services";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { openExternal } from "utils/electron-utils";

import { Icon } from "../Icon";

const AnchorStyled = styled.a(() => [
	tw`relative inline-block space-x-2 font-semibold text-theme-primary-600`,
	tw`transition-colors`,
	tw`cursor-pointer no-underline`,
	tw`hover:text-theme-primary-700`,
	tw`active:text-theme-primary-400`,
	tw`focus:(outline-none after:ring-2)`,
	tw`after:(content absolute inset-0 -m-1 ring-theme-primary-400 rounded)`,
	css`
		& :focus:not([data-focus-visible-added]) {
			&:after {
				${tw`ring-0`}
			}
		}
	`,
]);

const Content = styled.span(() => [
	tw`break-all border-b border-transparent group-hover:border-current`,
	tw`transition-property[color, border-color]`,
	tw`transition-duration[200ms, 350ms]`,
	tw`transition-delay[0s, 100ms]`,
]);

type AnchorProperties = {
	isExternal?: boolean;
	navigate?: () => void;
	showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProperties>(
	({ isExternal, showExternalIcon, href, children, rel, ...properties }: AnchorProperties, reference) => (
		<AnchorStyled
			className="group"
			data-testid="Link"
			rel={isExternal ? "noopener noreferrer" : rel}
			ref={reference}
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
				return properties.navigate?.();
			}}
			href={href || "#"}
			{...properties}
		>
			<Content>{children}</Content>
			{isExternal && showExternalIcon && (
				<span className="align-middle">
					<Icon
						data-testid="Link__external"
						name="Redirect"
						className={cn("flex-shrink-0 duration-200", { "inline-block pb-px text-sm": children })}
					/>
				</span>
			)}
		</AnchorStyled>
	),
);

Anchor.displayName = "Anchor";

type Properties = {
	isExternal?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
	showExternalIcon?: boolean;
} & Omit<LinkProps, "referrerPolicy">;

export const Link = ({ tooltip, ...properties }: Properties) => {
	const { t } = useTranslation();

	return (
		<Tooltip content={tooltip} disabled={!tooltip}>
			{properties.isExternal ? (
				<Anchor
					onClick={(event) => {
						event.stopPropagation();
						event.preventDefault();
						try {
							openExternal(properties.to);
						} catch {
							toasts.error(t("COMMON.ERRORS.INVALID_URL", { url: properties.to }));
						}
					}}
					{...properties}
				/>
			) : (
				<RouterLink component={Anchor} {...properties} />
			)}
		</Tooltip>
	);
};

Link.defaultProps = {
	isExternal: false,
	showExternalIcon: true,
};
