import React from "react";

type BarItem = {
	value: number | string;
	color: string;
	label: string;
};
type PercentageBarProps = {
	data?: BarItem[];
	title?: string;
};

export const PercentageBar = ({ data, title }: PercentageBarProps) => {
	return (
		<div>
			<div className="flex">
				<div className="py-4 font-bold text-theme-neutral-800">{title}</div>
				<div className="flex justify-end flex-1">
					{data &&
						data.map((item: BarItem, index: number) => {
							return (
								<div key={index} className="py-4 pl-6 pr-0 ml-3">
									<div
										className={`mr-2 mb-1 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
									/>
									<div className="inline-block text-sm font-semibold text-theme-neutral-700">
										{item.label} - {item.value}%
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<div className="flex">
				{data &&
					data.map((item: BarItem, index: number) => {
						return (
							<div
								key={index}
								className={`h-1 -ml-1 rounded-sm bg-theme-${item.color}`}
								style={{
									width: `calc(${item.value}% + 0.25rem)`,
								}}
							/>
						);
					})}
			</div>
		</div>
	);
};

PercentageBar.defaultProps = {
	data: [],
};
