import React from "react";
import twConfig from "tailwind.config";

type CircularProgressBarProps = {
	size: number;
	strokeWidth: number;
	strokeColor?: string;
	progressColor?: string;
	value: number;
	fontSize?: number;
};

export const CircularProgressBar = ({
	size,
	strokeWidth,
	strokeColor,
	progressColor,
	value,
	fontSize,
}: CircularProgressBarProps) => {
	// Enclose circle in a circumscribing square
	const viewBox = `0 0 ${size} ${size}`;
	// SVG centers the stroke width on the radius, subtract out so circle fits in square
	const radius = (size - strokeWidth) / 2;
	// Arc length at 100% coverage is the circle circumference
	const dashArray = radius * Math.PI * 2;
	// Scale 100% coverage overlay with the actual percent
	const dashOffset = dashArray - (dashArray * value) / 100;

	return (
		<svg width={size} height={size} viewBox={viewBox}>
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
			<text
				x="50%"
				y="50%"
				dy="0.3em"
				fill={progressColor}
				fontSize={`${fontSize}rem`}
				fontWeight="600"
				textAnchor="middle"
				data-testid="circular-progress-bar__percentage"
			>
				{`${value}%`}
			</text>
		</svg>
	);
};

CircularProgressBar.defaultProps = {
	size: 130,
	strokeWidth: 10,
	strokeColor: twConfig.theme.colors["theme-success-200"],
	progressColor: twConfig.theme.colors["theme-success-600"],
	value: 0,
	fontSize: 2,
};
