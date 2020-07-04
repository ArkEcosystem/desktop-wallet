import React from "react";

type TransactionDetailProps = {
	children: React.ReactNode;
	label?: string;
	extra?: React.ReactNode;
	border?: boolean;
	padding?: boolean;
	className?: string;
};

export const TransactionDetail = ({ border, children, className, extra, label, padding }: TransactionDetailProps) => (
	<div
		className={`flex items-center ${!padding || "py-6"} ${
			!border || "border-t border-dashed border-theme-neutral-300"
		} ${className}`}
	>
		<div className="flex-1">
			{label && <div className="text-sm font-semibold text-theme-neutral-500">{label}</div>}

			<div className="mt-2 font-semibold">{children}</div>
		</div>

		{extra ? extra : null}
	</div>
);

TransactionDetail.defaultProps = {
	className: "",
	border: true,
	padding: true,
};
