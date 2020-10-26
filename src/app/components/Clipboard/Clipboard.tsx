import { Tooltip } from "app/components/Tooltip";
import { useClipboard } from "app/hooks";
import React from "react";
import { useTranslation } from "react-i18next";

type ClipboardProps = {
	data: string | object;
	tooltip?: string;
	options?: Record<string, any>;
	children: React.ReactNode;
};

export const Clipboard = ({ data, tooltip, options, children }: ClipboardProps) => {
	const { t } = useTranslation();

	const [hasCopied, copy] = useClipboard({
		resetAfter: 1000,
		...options,
	});

	if (!children) {
		return null;
	}

	return (
		<Tooltip
			content={hasCopied ? t("COMMON.CLIPBOARD.SUCCESS") : tooltip || t("COMMON.CLIPBOARD.TOOLTIP_TEXT")}
			hideOnClick={false}
		>
			<div data-testid="clipboard__wrapper" className="inline-block cursor-pointer" onClick={() => copy(data)}>
				{children}
			</div>
		</Tooltip>
	);
};

Clipboard.defaultProps = {
	data: "",
	options: {},
};
