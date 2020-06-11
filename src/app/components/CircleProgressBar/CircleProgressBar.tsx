// Packages
import React, { useState, useEffect } from "react";
import tw, { styled } from "twin.macro";

type CircleProgressBarBaseProps = {
	strokeColor?: string;
	strokeWidth?: number;
	percentage: number;
	percentageColor: string;
	trailStrokeWidth?: number;
	trailStrokeColor?: string;
	trailSpaced?: boolean;
	speed: number;
	maxSize: string;
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
	strokeColor,
	strokeWidth,
	percentage,
	trailStrokeWidth,
	trailStrokeColor,
	trailSpaced,
	speed,
	percentageColor,
	maxSize,
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
	strokeColor: "blue",
	strokeWidth: 1,
	percentage: 0,
	percentageColor: "black",
	trailStrokeWidth: 1,
	trailStrokeColor: "#ddd",
	trailSpaced: false,
	speed: 1,
	maxSize: "100vh",
};
