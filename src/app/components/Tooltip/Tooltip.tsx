import { TippyProps } from "@tippyjs/react";
import { useThemeName } from "app/hooks";
import React from "react";

import { Tippy } from "./Tooltip.styles";

export type TooltipProps = {
	variant: "default" | "small";
} & TippyProps;

export const Tooltip = (props: TooltipProps) => {
	const theme = useThemeName();
	if (!props.content) {
		return <>{props.children}</>;
	}
	return <Tippy maxWidth={600} theme={theme} {...props} />;
};

Tooltip.defaultProps = {
	variant: "default",
};
