// Packages
import React, { useState, useEffect } from "react";
import tw, { styled } from "twin.macro";

import twConfig from "tailwind.config";

type CircleProgressBarProps = {
	size: number;
	trailStrokeWidth?: number;
	trailStrokeColor?: string;
	strokeWidth?: number;
	strokeColor?: string;
	percentage: number;
	percentageColor: string;
	speed: number;
};

const Container = styled.figure<{ size: number }>`
	max-width: ${(props) => `${props.size}%`};
	vertical-align: middle;
`;

const InnerContainer = styled.g<{ percentageColor: string }>`
	fill: ${(props) => props.percentageColor};
	transform: translateY(0.45rem);
`;

const Text = styled.text`
	${tw`font-semibold leading-none`}
	font-size: 0.5rem;
	text-anchor: middle;
	transform: translateY(-0.25rem);
`;

const CIRCLE_CONFIG = {
	viewBox: "0 0 38 38",
	x: "19",
	y: "19",
	radio: "15.91549430918954",
};

export const CircleProgressBar = ({
	size,
	trailStrokeWidth,
	trailStrokeColor,
	strokeWidth,
	strokeColor,
	percentage,
	percentageColor,
	speed,
}: CircleProgressBarProps) => {
	const [progressBar, setProgressBar] = useState(0);
	const paces = percentage / speed;

	const updatePercentage = () => {
		setTimeout(() => setProgressBar(progressBar + 1), paces);
	};

	useEffect(() => {
		if (percentage > 0) {
			updatePercentage();
		}
	}, [percentage]);

	useEffect(() => {
		if (progressBar < percentage) {
			updatePercentage();
		}
	}, [progressBar]);

	return (
		<Container size={size}>
			<svg viewBox={CIRCLE_CONFIG.viewBox}>
				<circle
					cx={CIRCLE_CONFIG.x}
					cy={CIRCLE_CONFIG.y}
					r={CIRCLE_CONFIG.radio}
					fill="transparent"
					stroke={trailStrokeColor}
					strokeWidth={trailStrokeWidth}
					strokeDasharray={0}
				/>

				<circle
					cx={CIRCLE_CONFIG.x}
					cy={CIRCLE_CONFIG.y}
					r={CIRCLE_CONFIG.radio}
					fill="transparent"
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeDasharray={`${progressBar} ${100 - progressBar}`}
					strokeDashoffset={25}
				/>

				<InnerContainer percentageColor={percentageColor}>
					<Text x="50%" y="50%" data-testid="circle-progress-bar__progress">
						{progressBar}%
					</Text>
				</InnerContainer>
			</svg>
		</Container>
	);
};

CircleProgressBar.defaultProps = {
	size: 10,
	trailStrokeWidth: 2,
	trailStrokeColor: twConfig.theme.colors["theme-success-200"],
	strokeWidth: 2,
	strokeColor: twConfig.theme.colors["theme-success-600"],
	percentage: 0,
	percentageColor: twConfig.theme.colors["theme-success-600"],
	speed: 1,
};
