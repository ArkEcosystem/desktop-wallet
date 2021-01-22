import { SvgCollection } from "app/assets/svg";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart as RechartsLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
	showAnimation?: boolean;
};

const ActiveDotSvg = SvgCollection["ChartActiveDot"];

const ActiveDot = ({ cx, cy, color }: any) => (
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

const Dot = ({ cx, cy, index }: any) => (
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

const ChartLegend = ({ legend = {}, lines, period, onPeriodClick }: any) => {
	const { t } = useTranslation();

	return (
		<div>
			<div className="flex space-x-3">
				{period && (
					<div
						className="pt-4 text-sm font-semibold cursor-pointer text-theme-secondary-text"
						onClick={onPeriodClick}
					>
						<div className="flex items-center">
							<div className="my-auto text-base">
								{t("COMMON.PERIOD")}: {period}
							</div>
							<div className="my-auto ml-1">
								<Icon name="ChevronDown" />
							</div>
						</div>
					</div>
				)}
				<div className="flex flex-1 justify-end space-x-3">
					{legend && (
						<div className="my-auto text-sm text-base text-theme-secondary-text">{legend?.label}</div>
					)}
					{lines &&
						lines.map((item: any, index: number) => (
							<div key={index} className="flex justify-end items-center p-4 pt-4 pr-0 min-w-32">
								<div
									className={`mr-2 border-2 rounded-full w-2 h-2 inline-block align-middle border-theme-${item.color}`}
								/>
								<div className="inline-block text-sm text-base font-semibold text-theme-secondary-text">
									{legend.formatted[item.dataKey] && <span>{legend.formatted[item.dataKey]} - </span>}
									{item.label}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

const Wrapper = styled.div`
	${chartStyles}
`;

export const ChartContent = ({
	period,
	onPeriodClick,
	data,
	lines,
	width,
	height,
	showAnimation = true,
}: LineChartProps) => {
	const defaultValue = data.concat().pop();
	const [legend, setLegend] = useState(defaultValue);

	return (
		<Wrapper data-testid="line-chart-wrapper" className="text-theme-secondary-300 dark:text-theme-secondary-800 pb">
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
				<CartesianGrid stroke="currentColor" />
				<Tooltip content={() => <div />} />
				{lines &&
					lines.map((line: any, index: number) => (
						<Line
							isAnimationActive={showAnimation}
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
					))}
			</RechartsLine>

			<div className="active-dot">
				<ActiveDot cy={0} cx={0} />
			</div>
		</Wrapper>
	);
};

export const LineChart = (props: LineChartProps) => {
	if (props.width) {
		return <ChartContent {...props} />;
	}
	return (
		<ResponsiveContainer height={props.height} className="mb-16">
			<ChartContent {...props} />
		</ResponsiveContainer>
	);
};

LineChart.defaultProps = {
	data: [],
	lines: [],
	height: 300,
};
