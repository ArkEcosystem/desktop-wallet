import cn from "classnames";
import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TransactionDetail.styles";

export interface TransactionDetailProperties {
	children?: React.ReactNode;
	label?: string | React.ReactNode;
	extra?: React.ReactNode;
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	padding?: boolean;
	paddingPosition?: "top" | "bottom" | "both" | "none";
	className?: string;
}

const TransactionDetailStyled = styled.div<TransactionDetailProperties>(getStyles);

export const TransactionDetail = React.forwardRef<HTMLDivElement, TransactionDetailProperties>(
	(
		{
			border,
			borderPosition,
			children,
			className,
			extra,
			label,
			padding,
			paddingPosition,
		}: TransactionDetailProperties,
		reference,
	) => (
		<TransactionDetailStyled
			data-testid="TransactionDetail"
			border={border}
			borderPosition={borderPosition}
			padding={padding}
			paddingPosition={paddingPosition}
			className={cn("no-ligatures", className)}
			ref={reference}
		>
			<div className="flex-1 space-y-2 w-40 whitespace-nowrap">
				{label && <div className="text-sm font-semibold text-theme-secondary-700 no-ligatures">{label}</div>}

				<div className="font-semibold">{children}</div>
			</div>

			{extra ? extra : null}
		</TransactionDetailStyled>
	),
);

TransactionDetail.displayName = "TransactionDetail";

TransactionDetail.defaultProps = {
	border: true,
	borderPosition: "top",
	padding: true,
};
