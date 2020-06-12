import React from "react";
import { styled } from "twin.macro";
import { getStyles } from "./style";

type Spinner = {
	color?: "primary" | "success" | "danger" | "warning";
	size?: "small" | "default" | "large";
};

export const Spinner = styled.div<Spinner>(getStyles);

Spinner.defaultProps = {
	color: "primary",
	size: "default",
};
