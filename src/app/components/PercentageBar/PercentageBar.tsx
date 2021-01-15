import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type BarItem = {
	color: string;
	label: string;
	percentage: number | string;
};

type PercentageBarProps = {
	data?: BarItem[];
	title?: string;
};

export const PercentageBar = ({ data, title }: PercentageBarProps) => {
	const { t } = useTranslation();

	const percentageData = useMemo(() => {
		const maxCoins = 3;

		if (data && data.length > maxCoins) {
			const lastData = data.splice(maxCoins, data.length);
			const otherData = lastData?.reduce(
				(acc, cur) => ({
					...acc,
					percentage: Number(acc.percentage) + Number(cur.percentage),
				}),
				{
					color: "neutral-400",
					label: t("COMMON.OTHER"),
					percentage: 0,
				},
			);

			data.push(otherData);

			return data;
		}

		return data;
	}, [data, t]);

	return (
		<div>
			<div className="flex space-x-3">
				<div className="py-4 text-lg font-bold text-theme-secondary-800">{title}</div>
				<div className="flex flex-1 justify-end space-x-3">
					{percentageData &&
						percentageData.map((item: BarItem, index: number) => (
							<div
								key={index}
								className="flex justify-end items-center py-4 pr-0 pl-6"
								data-testid="item-percentage"
							>
								<div
									className={`mr-2 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
								/>
								<div className="inline-block text-sm text-base font-semibold text-theme-secondary-text">
									<span>
										{item.label} - {item.percentage}%
									</span>
								</div>
							</div>
						))}
				</div>
			</div>
			<div className="flex -space-x-1">
				{percentageData &&
					percentageData.map((item: BarItem, index: number) => (
						<div
							key={index}
							className={`h-1 rounded-sm bg-theme-${item.color}`}
							style={{
								width: `calc(${item.percentage}% + 0.25rem)`,
							}}
						/>
					))}
			</div>
		</div>
	);
};

PercentageBar.defaultProps = {
	data: [],
};
