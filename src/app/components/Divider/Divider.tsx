import React from "react";
import { styled } from "twin.macro";
import { getStyles } from "./style";

type DividerProps = {
	type?: "horizontal" | "vertical";
};

export const Divider = styled.div<DividerProps>(getStyles);

Divider.defaultProps = {
	type: "horizontal",
};
