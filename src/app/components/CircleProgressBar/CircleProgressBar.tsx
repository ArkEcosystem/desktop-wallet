// Packages
import React, { useState, useEffect } from "react";
import tw, { styled } from "twin.macro";

import twConfig from "tailwind.config";

type CircleProgressBarBaseProps = {
	maxSize: string;
	trailStrokeWidth?: number;
	trailStrokeColor?: string;
	trailSpaced?: boolean;
	strokeWidth?: number;
	strokeColor?: string;
	percentage: number;
	percentageColor: string;
	speed: number;
};

const Container = styled.figure<{ maxSize: string }>`
	max-width: ${(props) => props.maxSize};
	vertical-align: middle;
`;

const InnerContainer = styled.g<{ percentageColor: string }>`
	fill: ${(props) => props.percentageColor};
	transform: translateY(0.25rem);
`;

const Text = styled.text`
	${tw`leading-none`}
	font-size: 0.6rem;
	text-anchor: middle;
	transform: translateY(-0.25rem);
`;

export const CircleProgressBar = ({
	maxSize,
	trailStrokeWidth,
	trailStrokeColor,
	trailSpaced,
	strokeWidth,
	strokeColor,
	percentage,
	percentageColor,
	speed,
}: CircleProgressBarBaseProps) => {
	const [progressBar, setProgressBar] = useState(0);
	const paces = percentage / speed;
	const circleConfig = {
		viewBox: "0 0 38 38",
		x: "19",
		y: "19",
		radio: "15.91549430918954",
	};

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
		<Container maxSize={maxSize}>
			<svg viewBox={circleConfig.viewBox}>
				<circle
					cx={circleConfig.x}
					cy={circleConfig.y}
					r={circleConfig.radio}
					fill="transparent"
					stroke={trailStrokeColor}
					strokeWidth={trailStrokeWidth}
					strokeDasharray={trailSpaced ? 1 : 0}
				/>

				<circle
					cx={circleConfig.x}
					cy={circleConfig.y}
					r={circleConfig.radio}
					fill="transparent"
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeDasharray={`${progressBar} ${100 - progressBar}`}
					strokeDashoffset={25}
				/>

				<InnerContainer percentageColor={percentageColor}>
					<Text x="50%" y="50%">
						{progressBar}%
					</Text>
				</InnerContainer>
			</svg>
		</Container>
	);
};

CircleProgressBar.defaultProps = {
	maxSize: "100vh",
	trailStrokeWidth: 1,
	trailStrokeColor: twConfig.theme.colors["theme-success-200"],
	trailSpaced: false,
	strokeWidth: 1,
	strokeColor: twConfig.theme.colors["theme-success-600"],
	percentage: 0,
	percentageColor: twConfig.theme.colors["theme-success-600"],
	speed: 1,
};
