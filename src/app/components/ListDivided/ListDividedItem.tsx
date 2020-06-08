import React from "react";

type Props = {
	isFloatingLabel: boolean;
	labelClass: string;
	label: string;
	labelDescription: string;
	labelDescriptionClass: string;
	value: string;
	itemValueClass: string;
	content: React.ReactNode;
};

export const ListDividedItem = ({
	isFloatingLabel,
	labelClass,
	label,
	labelDescription,
	labelDescriptionClass,
	value,
	itemValueClass,
	content,
}: Props) => (
	<li className="flex flex-col w-full py-8 mb-5" data-testid="list-divided-item__wrapper">
		<div
			className={`flex justify-between ${isFloatingLabel ? "flex-col items-start" : "items-center"}`}
			data-testid="list-divided-item__inner-wrapper"
		>
			<div className="flex flex-col">
				<span className={`mr-5 ${labelClass}`} data-testid="list-divided-item__label">
					{label}
				</span>
				{labelDescription && (
					<span
						className={`text-sm text-theme-neutral ${labelDescriptionClass}`}
						data-testid="list-divided-item__label--description"
					>
						{labelDescription}
					</span>
				)}
			</div>
			{value && (
				<div className={`${itemValueClass}`}>
					<span data-testid="list-divided-item__value">{value}</span>
				</div>
			)}
		</div>
		{content && (
			<div className="mt-4" data-testid="list-divided-item__content">
				{content}
			</div>
		)}
	</li>
);
