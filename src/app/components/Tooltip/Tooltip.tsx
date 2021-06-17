import Tippy, { TippyProps } from "@tippyjs/react";
import { useTheme } from "app/hooks";
import React from "react";
import { Size } from "types";

import { getVariantClassNames } from "./Tooltip.styles";

export type TooltipProps = {
	variant: Size;
} & TippyProps;

export const Tooltip = ({ variant, ...properties }: TooltipProps) => {
	const { theme } = useTheme();
	if (!properties.content) {
		return <>{properties.children}</>;
	}
	return <Tippy maxWidth={600} theme={theme} {...properties} className={getVariantClassNames(variant)} />;
};

Tooltip.defaultProps = {
	variant: "5xl", // Trigger default handler
};
