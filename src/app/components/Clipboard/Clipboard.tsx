import React from "react";

import { ClipboardButton, ClipboardButtonProps } from "./ClipboardButton";
import { ClipboardIcon, ClipboardIconProps } from "./ClipboardIcon";

export interface ClipboardCommonProps {
	data: string | Record<string, unknown>;
	options?: Record<string, any>;
	children: React.ReactNode;
}

type ClipboardProps = ClipboardIconProps | ClipboardButtonProps;

export const Clipboard = (props: ClipboardProps) => {
	if (!props.children) {
		return null;
	}

	if (props.variant === "icon") {
		return <ClipboardIcon {...props}>{props.children}</ClipboardIcon>;
	}

	return <ClipboardButton {...props}>{props.children}</ClipboardButton>;
};

Clipboard.defaultProps = {
	options: {},
};
