import Tippy, { TippyProps } from "@tippyjs/react";
import { useThemeContext } from "app/contexts";
import React from "react";

export const Tooltip = (props: TippyProps) => {
	const { theme } = useThemeContext();
	return <Tippy maxWidth={600} theme={theme} {...props} />;
};
