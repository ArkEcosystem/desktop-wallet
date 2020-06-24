import { SvgCollection } from "app/assets/svg";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart as RechartsLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Icon } from "../Icon";

type LineChartProps = {
	data: any[];
	lines: any[];
	period: string;
	onPeriodClick?: () => void;
};

const ActiveDotSvg = SvgCollection["ChartActiveDot"];
const ActiveDot = ({ cx, cy, color }: any) => {
	return (
		<ActiveDotSvg
			className={`text-theme-${color}`}
			width={50}
			height={50}
			x={cx - 25}
			y={cy - 25}
			fill="currentColor"
			stroke="currentColor"
		/>
	);
};

const ChartLegend = ({ legend, lines, period, onPeriodClick }: any) => {
	return (
		<div>
			<div className="flex">
				{period && (
					<div
						className="py-4 text-theme-neutral-700 font-semibold text-sm ml-3 cursor-pointer"
						onClick={onPeriodClick}
					>
						<div className="flex">
							<div className="my-auto">Period: {period}</div>
							<div className="my-auto">
								<Icon name="ChevronDown" />
							</div>
						</div>
					</div>
				)}
				<div className="flex justify-end flex-1">
					<div className="my-auto ml-3 text-sm text-theme-neutral-600">{legend.label}</div>
					{lines &&
						lines.map((item: any, index: number) => {
							return (
								<div key={index} className="p-4 ml-3 w-36 text-right">
									<div
										className={`mr-2 mb-1 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
									/>
									<div className="inline-block text-sm font-semibold text-theme-neutral-700">
										{legend[item.dataKey]} - {item.label}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export const LineChart = ({ data, lines, period, onPeriodClick }: LineChartProps) => {
	const [updatingLegend, setUpdatingLegend] = useState(false);
	const [legend, setLegend] = useState(data[0]);

	const updateLegendData = ({ payload }: any) => {
		setUpdatingLegend(true);
		setLegend(payload);
		setTimeout(() => setUpdatingLegend(false), 100);
	};

	return (
		<div>
			<ChartLegend legend={legend} lines={lines} period={period} onPeriodClick={onPeriodClick} />
			<div className="text-theme-neutral-200">
				<ResponsiveContainer width="100%" height={300}>
					<RechartsLine data={data} margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
						<XAxis dataKey="name" />
						<CartesianGrid stroke="currentColor" />
						<Tooltip
							position={{ y: 200 }}
							content={(cdata: any) => {
								if (typeof cdata.payload[0] !== "undefined") {
									if (updatingLegend === true) return <div />;
									updateLegendData(cdata.payload[0]);
								}
								return <div />;
							}}
						/>
						{lines &&
							lines.map((line: any, index: number) => {
								return (
									<Line
										type="monotone"
										key={index}
										dataKey={line.dataKey}
										stroke="currentColor"
										fill="currentColor"
										className={`text-theme-${line.color}`}
										strokeWidth={3}
										yAxisId={0}
										activeDot={<ActiveDot {...line} />}
										dot={{ stroke: "currentColor", fill: "#FFFFFF", strokeWidth: 3, r: 5 }}
									/>
								);
							})}
					</RechartsLine>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

LineChart.defaultProps = {
	data: [],
	lines: [],
};
