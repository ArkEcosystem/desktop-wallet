import { SvgCollection } from "app/assets/svg";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart as RechartsLine, ResponsiveContainer, Tooltip, XAxis,YAxis } from "recharts";
import { styled } from "twin.macro";

import { Icon } from "../Icon";
import { chartStyles } from "./LineChart.styles";

type LineChartProps = {
	data: any[];
	lines: any[];
	period?: string;
	onPeriodClick?: () => void;
	width?: number;
	height?: number;
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

const ChartLegend = ({ legend = {}, lines, period, onPeriodClick }: any) => {
	return (
		<div>
			<div className="flex">
				{period && (
					<div
						className="py-4 text-theme-neutral-700 font-semibold text-sm cursor-pointer"
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
								<div key={index} className="p-4 pr-0 ml-3 w-36 text-right">
									<div
										className={`mr-2 mb-1 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
									/>
									<div className="inline-block text-sm font-semibold text-theme-neutral-700">
										{legend[item.dataKey] && <span>{legend[item.dataKey]} - </span>}
										{item.label}
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

const Wrapper = styled.div`
	${chartStyles}
`;

export const ChartContent = ({ period, onPeriodClick, data, lines, width, height }: LineChartProps) => {
	const defaultValue = data.concat().pop();
	const [legend, setLegend] = useState(defaultValue);

	return (
		<Wrapper data-testid="line-chart-wrapper" className="text-theme-neutral-300">
			<ChartLegend legend={legend} lines={lines} period={period} onPeriodClick={onPeriodClick} />
			<RechartsLine
				width={width}
				height={height}
				onMouseMove={({ activePayload = [] }) => {
					const { payload } = activePayload[0] || {};
					setLegend(Object.assign({}, defaultValue, payload));
				}}
				data={data}
				margin={{ top: 0, bottom: 0, left: 26, right: 0 }}
			>
				<XAxis dataKey="name" axisLine={false} tick={{ fill: "currentcolor" }} tickSize={20} minTickGap={40} />
				<YAxis axisLine={false} tick={{ fill: "currentColor" }} tickSize={40} />
				<CartesianGrid stroke="currentColor" className="test" />
				<Tooltip content={() => <div />} />
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
								dot={<Dot {...line} {...index} />}
							/>
						);
					})}
			</RechartsLine>

			<div className="active-dot">
				<ActiveDot cy={0} cx={0} />
			</div>
		</Wrapper>
	);
};

export const LineChart = (props: LineChartProps) => {
	if (props.width) return <ChartContent {...props} />;
	return (
		<ResponsiveContainer height={props.height}>
			<ChartContent {...props} />
		</ResponsiveContainer>
	);
};

LineChart.defaultProps = {
	data: [],
	lines: [],
	height: 300,
};
