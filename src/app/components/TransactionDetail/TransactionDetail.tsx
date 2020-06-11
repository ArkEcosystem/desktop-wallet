import React from "react";

type TransactionDetailProps = {
	children: React.ReactNode;
	label: string;
	extra?: React.ReactNode;
	border?: boolean;
	className?: string;
};

export const TransactionDetail = (props: TransactionDetailProps) => (
	<div
		className={`flex items-center py-4 ${!props.border || "border-t border-dashed border-theme-neutral-300"} ${
			props.className
		}`}
	>
		<div className="flex-1">
			<div className="font-semibold text-sm text-theme-neutral-500">{props.label}</div>

			<div className="font-semibold mt-2">{props.children}</div>
		</div>

		{props.extra ? props.extra : null}
	</div>
);

TransactionDetail.defaultProps = {
	className: "",
	border: true,
};
