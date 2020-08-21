import React from "react";

type TransactionDetailProps = {
	children: React.ReactNode;
	label?: any;
	extra?: React.ReactNode;
	border?: boolean;
	padding?: boolean;
	className?: string;
};

export const TransactionDetail = ({ border, children, className, extra, label, padding }: TransactionDetailProps) => (
	<div
		data-testid="TransactionDetail"
		className={`flex items-center ${!padding || "py-6"} ${
			!border || "border-t border-dashed border-theme-neutral-300"
		} ${className}`}
	>
		<div className="flex-1 space-y-2">
			{label && <div className="text-sm font-semibold text-theme-neutral">{label}</div>}

			<div className="font-semibold">{children}</div>
		</div>

		{extra ? extra : null}
	</div>
);

TransactionDetail.defaultProps = {
	className: "",
	border: true,
	padding: true,
};
