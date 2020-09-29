import { Label } from "app/components/Label";
import React from "react";

export type TransactionDetailProps = {
	children?: React.ReactNode;
	label?: any;
	labelExtra?: string;
	labelExtraColor?: "primary" | "success" | "danger" | "warning";
	extra?: React.ReactNode;
	border?: boolean;
	borderPosition: "top" | "bottom";
	padding?: boolean;
	className?: string;
};

export const TransactionDetail = ({
	border,
	borderPosition,
	children,
	className,
	extra,
	label,
	labelExtra,
	labelExtraColor,
	padding,
}: TransactionDetailProps) => (
	<div
		data-testid="TransactionDetail"
		className={`flex items-center ${!padding || "py-6"} ${
			!border || `${borderPosition === "top" ? "border-t" : "border-b"} border-dashed border-theme-neutral-300`
		} ${className}`}
	>
		<div className="flex-1 space-y-2">
			{label && (
				<div className="text-sm font-semibold text-theme-neutral">
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
	</div>
);

TransactionDetail.defaultProps = {
	className: "",
	border: true,
	borderPosition: "top",
	padding: true,
};
