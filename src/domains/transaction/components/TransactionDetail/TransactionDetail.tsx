import { Label } from "app/components/Label";
import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TransactionDetail.styles";

export type TransactionDetailProps = {
	children?: React.ReactNode;
	label?: any;
	labelExtra?: string;
	labelExtraColor?: "primary" | "success" | "danger" | "warning";
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
	labelExtra,
	labelExtraColor,
	paddingPosition,
}: TransactionDetailProps) => (
	<TransactionDetailStyled
		data-testid="TransactionDetail"
		border={border}
		borderPosition={borderPosition}
		paddingPosition={paddingPosition}
		className={className}
	>
		<div className="flex-1 space-y-2">
			{label && (
				<div className="text-sm font-semibold text-theme-neutral-700">
					{labelExtra ? (
						<>
							<span className="mr-1">{label}</span>
							<Label color={labelExtraColor || "warning"}>
								<span className="text-sm">{labelExtra}</span>
							</Label>
						</>
					) : (
						label
					)}
				</div>
			)}

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
