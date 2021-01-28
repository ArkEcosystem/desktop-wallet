import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TransactionDetail.styles";

export type TransactionDetailProps = {
	children?: React.ReactNode;
	label?: string;
	extra?: React.ReactNode;
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	paddingPosition?: "top" | "bottom" | "both";
	className?: string;
};

const TransactionDetailStyled = styled.div<TransactionDetailProps>(getStyles);

export const TransactionDetail = ({
	border,
	borderPosition,
	children,
	className,
	extra,
	label,
	paddingPosition,
}: TransactionDetailProps) => (
	<TransactionDetailStyled
		data-testid="TransactionDetail"
		border={border}
		borderPosition={borderPosition}
		paddingPosition={paddingPosition}
		className={`${className} no-ligatures`}
	>
		<div className="space-y-2 flex-1">
			{label && <div className="text-sm font-semibold text-theme-secondary-700">{label}</div>}

			<div className="font-semibold">{children}</div>
		</div>

		{extra ? extra : null}
	</TransactionDetailStyled>
);

TransactionDetail.defaultProps = {
	border: true,
	borderPosition: "top",
	padding: true,
};
