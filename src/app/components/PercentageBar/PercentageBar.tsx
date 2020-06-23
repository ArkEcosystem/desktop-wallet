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
				<div className="font-bold py-4 text-theme-neutral-800">{title}</div>
				<div className="flex flex-1 justify-end">
					{data &&
						data.map((item: BarItem, index: number) => {
							return (
								<div key={index} className="p-4 ml-3">
									<div
										className={`mr-2 mb-1 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
									 />
									<div className="inline-block text-theme-neutral-700 font-semibold text-sm">
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
									width: `${item.value}%`,
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
