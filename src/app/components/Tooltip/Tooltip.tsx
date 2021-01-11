import Tippy, { TippyProps } from "@tippyjs/react";
import { useThemeName } from "app/hooks";
import React from "react";

export const Tooltip = (props: TippyProps) => {
	const theme = useThemeName();
	if (!props.content) return <>{props.children}</>;
	return <Tippy maxWidth={600} theme={theme} {...props} />;
};
