import React from "react";

import { ClipboardButton, ClipboardButtonProperties } from "./ClipboardButton";
import { ClipboardIcon, ClipboardIconProperties } from "./ClipboardIcon";

export interface ClipboardCommonProperties {
	data: string | object;
	options?: Record<string, any>;
	children: React.ReactNode;
}

type ClipboardProperties = ClipboardIconProperties | ClipboardButtonProperties;

export const Clipboard = (properties: ClipboardProperties) => {
	if (!properties.children) {
		return null;
	}

	if (properties.variant === "icon") {
		return <ClipboardIcon {...properties}>{properties.children}</ClipboardIcon>;
	}

	return <ClipboardButton {...properties}>{properties.children}</ClipboardButton>;
};

Clipboard.defaultProps = {
	options: {},
};
