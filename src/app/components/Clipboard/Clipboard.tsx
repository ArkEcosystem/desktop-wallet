import React from "react";

import { ClipboardButton, ClipboardButtonProps } from "./ClipboardButton";
import { ClipboardIcon, ClipboardIconProps } from "./ClipboardIcon";

export type ClipboardCommonProps = {
	data: string | object;
	options?: Record<string, any>;
	children: React.ReactNode;
};

type ClipboardProps = ClipboardIconProps | ClipboardButtonProps;

export const Clipboard = (props: ClipboardProps) => {
	if (props.variant === "icon") {
		return <ClipboardIcon {...props}>{props.children}</ClipboardIcon>;
	}

	return <ClipboardButton {...props}>{props.children}</ClipboardButton>;
};

Clipboard.defaultProps = {
	options: {},
};
