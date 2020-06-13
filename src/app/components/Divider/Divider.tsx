import { styled } from "twin.macro";
import { getStyles } from "./Divider.styles";

type DividerProps = {
	type?: "horizontal" | "vertical";
	dashed?: boolean;
};

export const Divider = styled.div<DividerProps>(getStyles);

Divider.defaultProps = {
	type: "horizontal",
};
