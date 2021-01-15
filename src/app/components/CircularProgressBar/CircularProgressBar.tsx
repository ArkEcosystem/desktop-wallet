import React from "react";

type CircularProgressBarProps = {
	size: number;
	strokeWidth: number;
	strokeColor?: string;
	progressColor?: string;
	value: number;
	fontSize?: number;
	showValue: boolean;
	className?: string;
};

export const CircularProgressBar = ({
	size,
	strokeWidth,
	strokeColor,
	progressColor,
	value,
	fontSize,
	showValue,
	className,
}: CircularProgressBarProps) => {
	// Enclose circle in a circumscribed square
	const viewBox = `0 0 ${size} ${size}`;
	// SVG centers the stroke width in the radius and subtracts so that the circle fits the square
	const radius = (size - strokeWidth) / 2;
	// Arc length at 100% coverage is the circle circumference
	const dashArray = radius * Math.PI * 2;
	// Scale 100% coverage overlay with the actual percent
	const dashOffset = dashArray - (dashArray * value) / 100;

	return (
		<svg width={size} height={size} viewBox={viewBox} className={className}>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="transparent"
				strokeWidth={strokeWidth}
				stroke={strokeColor}
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="transparent"
				strokeWidth={strokeWidth}
				stroke={progressColor}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={dashArray}
				strokeDashoffset={dashOffset}
				// Start progress marker at 12 O'Clock
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
			/>
			{showValue && (
				<text
					x="50%"
					y="50%"
					dy="0.3em"
					fill={progressColor}
					fontSize={`${fontSize}rem`}
					fontWeight="600"
					textAnchor="middle"
					data-testid="CircularProgressBar__percentage"
				>
					<tspan>
						{value}
						<tspan dy="-0.6em" fontSize={`${fontSize! / 2}rem`} fontWeight="bold">
							%
						</tspan>
					</tspan>
				</text>
			)}
		</svg>
	);
};

CircularProgressBar.defaultProps = {
	size: 130,
	strokeWidth: 10,
	strokeColor: "var(--theme-color-success-200)",
	progressColor: "var(--theme-color-success-600)",
	fontSize: 2,
	value: 0,
	showValue: true,
};
