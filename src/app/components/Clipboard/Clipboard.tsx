import "tippy.js/dist/tippy.css";

import Tippy from "@tippyjs/react";
import { useClipboard } from "app/hooks";
import React from "react";
import { useTranslation } from "react-i18next";

type ClipboardProps = {
	data: string | object;
	options?: any;
	children: React.ReactNode;
};

export const Clipboard = ({ data, options, children }: ClipboardProps) => {
	const { t } = useTranslation();

	const [hasCopied, copy] = useClipboard({
		resetAfter: 1000,
		...options,
	});

	if (!children) {
		return null;
	}

	return (
		<Tippy
			content={hasCopied ? t("COMMON.CLIPBOARD.SUCCESS") : t("COMMON.CLIPBOARD.TOOLTIP_TEXT")}
			hideOnClick={false}
		>
			<div data-testid="clipboard__wrapper" className="inline-block cursor-pointer" onClick={() => copy(data)}>
				{children}
			</div>
		</Tippy>
	);
};

Clipboard.defaultProps = {
	data: "",
	options: {},
};
