import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TransactionDetail.styles";

export type TransactionDetailProps = {
	children?: React.ReactNode;
	label?: string;
	extra?: React.ReactNode;
	border?: boolean;
	borderPosition?: "top" | "bottom" | "both";
	padding?: boolean;
	paddingPosition?: "top" | "bottom" | "both" | "none";
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
	padding,
	paddingPosition,
}: TransactionDetailProps) => (
	<TransactionDetailStyled
		data-testid="TransactionDetail"
		border={border}
		borderPosition={borderPosition}
		padding={padding}
		paddingPosition={paddingPosition}
		className={`${className} no-ligatures`}
	>
		<div className="flex-1 space-y-2">
			{label && <div className="text-sm font-semibold text-theme-secondary-700 no-ligatures">{label}</div>}

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
