import Tippy, { TippyProps } from "@tippyjs/react";
import { useThemeName } from "app/hooks";
import React from "react";
import { Size } from "types";

import { getVariantClassNames } from "./Tooltip.styles";

export type TooltipProps = {
	variant: Size;
} & TippyProps;

export const Tooltip = ({ variant, ...props }: TooltipProps) => {
	const theme = useThemeName();
	if (!props.content) {
		return <>{props.children}</>;
	}
	return <Tippy maxWidth={600} theme={theme} {...props} className={getVariantClassNames(variant)} />;
};

Tooltip.defaultProps = {
	variant: "5xl", // Trigger default handler
};
