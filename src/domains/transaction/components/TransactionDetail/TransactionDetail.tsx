import cn from "classnames";
import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TransactionDetail.styles";

export interface TransactionDetailProps {
	children?: React.ReactNode;
	label?: string | React.ReactNode;
	extra?: React.ReactNode;
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	padding?: boolean;
	paddingPosition?: "top" | "bottom" | "both" | "none";
	className?: string;
}

const TransactionDetailStyled = styled.div<TransactionDetailProps>(getStyles);

export const TransactionDetail = React.forwardRef<HTMLDivElement, TransactionDetailProps>(
	(
		{ border, borderPosition, children, className, extra, label, padding, paddingPosition }: TransactionDetailProps,
		ref,
	) => (
		<TransactionDetailStyled
			data-testid="TransactionDetail"
			border={border}
			borderPosition={borderPosition}
			padding={padding}
			paddingPosition={paddingPosition}
			className={cn("no-ligatures", className)}
			ref={ref}
		>
			<div className="w-40 flex-1 space-y-2 whitespace-nowrap">
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
