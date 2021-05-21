import { Tooltip } from "app/components/Tooltip";
import { useClipboard } from "app/hooks";
import React from "react";
import { useTranslation } from "react-i18next";

import { ClipboardCommonProps } from "./Clipboard";

export type ClipboardIconProps = ClipboardCommonProps & {
	variant: "icon";
	tooltip?: string;
};

export const ClipboardIcon = ({ data, tooltip, options, children }: ClipboardIconProps) => {
	const { t } = useTranslation();

	const [hasCopied, copy] = useClipboard({
		resetAfter: 1000,
		...options,
	});

	return (
		<Tooltip
			content={hasCopied ? t("COMMON.CLIPBOARD.SUCCESS") : tooltip || t("COMMON.CLIPBOARD.TOOLTIP_TEXT")}
			hideOnClick={false}
		>
			<button
				type="button"
				data-testid="clipboard__wrapper"
				className="relative focus:outline-none group"
				onClick={() => copy(data)}
			>
				{/* border on focus */}
				<div className="absolute inset-0 -m-1 rounded ring-theme-primary-400 group-focus:ring-2 group-focus-visible" />

				{children}
			</button>
		</Tooltip>
	);
};
