import { SvgCollection } from "app/assets/svg";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart as RechartsLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Icon } from "../Icon";

type LineChartProps = {
	data: any[];
	lines: any[];
	period?: string;
	onPeriodClick?: () => void;
	width?: number | string;
	height?: number | string;
};

const ActiveDotSvg = SvgCollection["ChartActiveDot"];
const ActiveDot = ({ cx, cy, color }: any) => {
	return (
		<ActiveDotSvg
			data-testid="active-dot"
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

const Dot = ({ cx, cy, index }: any) => {
	return (
		<circle
			cy={cy}
			cx={cx}
			r="5"
			data-testid={`line-chart-dot-${index}`}
			type="monotone"
			stroke="currentColor"
			fill="#FFFFFF"
			className="recharts-dot recharts-l2ne-dot"
			strokeWidth="3"
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
					{legend && <div className="my-auto ml-3 text-sm text-theme-neutral-600">{legend?.label}</div>}
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

export const LineChart = ({ data, lines, period, onPeriodClick, width, height }: LineChartProps) => {
	const [updatingLegend, setUpdatingLegend] = useState(false);
	const [legend, setLegend] = useState(data[0]);

	const updateLegendData = ({ payload }: any) => {
		setUpdatingLegend(true);
		setLegend(payload);
		setUpdatingLegend(false);
		// setTimeout(() => setUpdatingLegend(false), 2);
	};

	return (
		<div>
			<ChartLegend legend={legend} lines={lines} period={period} onPeriodClick={onPeriodClick} />
			<div className="text-theme-neutral-200" data-testid="line-chart-wrapper">
				<ResponsiveContainer width={width} height={height}>
					<RechartsLine
						data={data}
						margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
						data-testid="chart-line"
					>
						<XAxis dataKey="name" />
						<CartesianGrid stroke="currentColor" />
						<Tooltip
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
										className={`chart-line text-theme-${line.color}`}
										strokeWidth={3}
										yAxisId={0}
										activeDot={<ActiveDot {...line} />}
										dot={<Dot {...line} {...index} />}
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
	width: "100%",
	height: 300,
};
