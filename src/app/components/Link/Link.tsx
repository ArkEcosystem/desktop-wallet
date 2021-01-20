import { Tooltip } from "app/components/Tooltip";
import { toasts } from "app/services";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { openExternal } from "utils/electron-utils";

import { Icon } from "../Icon";

const AnchorStyled = styled.a<{ isExternal: boolean }>`
	${({ isExternal }) =>
		isExternal &&
		css`
			&:hover,
			&:active {
				${tw`no-underline`}

				.underline-dotted {
					${tw`relative`}

					&:after {
						content: "";
						${tw`block w-full border-b absolute bottom-0 border-dotted`}
					}
				}
			}
		`}
`;

type AnchorProps = {
	isExternal?: boolean;
	navigate?: () => void;
	showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<any>;

const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
	({ isExternal, showExternalIcon, children, rel, ...props }: AnchorProps, ref) => (
		<AnchorStyled
			data-testid="Link"
			isExternal={isExternal!}
			className="inline-flex items-center font-semibold transition-colors duration-200 cursor-pointer text-theme-primary-600 hover:text-theme-primary-700 hover:underline active:text-theme-primary-500"
			rel={isExternal ? "noopener noreferrer" : rel}
			ref={ref}
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
				return props.navigate?.();
			}}
			{...props}
		>
			<span className="underline-dotted">{children}</span>
			{isExternal && showExternalIcon && (
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
	showExternalIcon?: boolean;
} & LinkProps;

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
