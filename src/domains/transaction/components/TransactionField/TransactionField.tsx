import React from "react";

type TransactionFieldProps = {
	border: boolean;
	children: React.ReactNode;
	className?: string;
	extra?: React.ReactNode;
	label?: string;
	padding?: boolean;
};

export const TransactionField = ({ border, children, className, extra, label, padding }: TransactionFieldProps) => (
	<div
		className={`flex items-center ${padding || "py-4"} ${
			!border || "border-t border-dashed border-theme-neutral-300"
		} ${className}`}
	>
		<div className="flex-1">
			{label && <div className="text-sm font-medium text-theme-neutral-700">{label}</div>}

			<div className="mt-2">{children}</div>
		</div>

		{extra ? extra : null}
	</div>
);

TransactionField.defaultProps = {
	className: "",
	border: false,
};
