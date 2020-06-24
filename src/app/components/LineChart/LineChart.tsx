import { SvgCollection } from "app/assets/svg";
import React from "react";
import { CartesianGrid,Line, LineChart as RechartsLine, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type LineChartProps = {
	data?: any[];
	lines?: any[];
};

const ActiveDotSvg = SvgCollection["ChartActiveDot"];
const ActiveDot = ({ cx, cy, className }: any) => {
	return (
		<ActiveDotSvg
			className={className}
			width={50}
			height={50}
			x={cx - 25}
			y={cy - 25}
			fill="currentColor"
			stroke="currentColor"
		/>
	);
};

export const LineChart = ({ data, lines }: LineChartProps) => {
	return (
		<div>
			<div className="text-theme-neutral-200">
				<ResponsiveContainer width="100%" height={300}>
					<RechartsLine data={data} margin={{ top: 10, bottom: 10, left: 30, right: 30 }}>
						<XAxis dataKey="name" />
						<CartesianGrid stroke="currentColor" />
						<Tooltip position={{ y: 200 }} content={<div />} />
						{lines &&
							lines.map((line: any, index: number) => {
								return (
									<Line
										type="monotone"
										key={index}
										dataKey={line.dataKey}
										stroke="currentColor"
										fill="currentColor"
										className={`${line.className}`}
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
