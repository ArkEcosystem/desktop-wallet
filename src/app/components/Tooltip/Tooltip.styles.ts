import TippyBase from "@tippyjs/react";
import tw, { styled } from "twin.macro";

import { TooltipProps } from "./Tooltip";

const getVariant = (variant: string) => {
	switch (variant) {
		case "small":
			return tw`text-xs font-medium`;
		default:
			return ``;
	}
};

export const Tippy = styled(TippyBase)<TooltipProps>`
	${({ variant }) => getVariant(variant)}
`;
