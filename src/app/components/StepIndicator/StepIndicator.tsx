import React from "react";
import tw, { styled } from "twin.macro";

type StepIndicatorProps = {
	activeIndex?: number;
	size?: number;
};

const StepStyled = styled.li<{ isActive: boolean }>`
	${tw`flex-1 bg-theme-neutral-300 rounded-lg transition-colors duration-300`}
	height: 2px;
	${({ isActive }) => isActive && tw`bg-theme-warning`}
`;

export const StepIndicator: React.FC<StepIndicatorProps> = (props: StepIndicatorProps) => {
    const steps = [...Array(props.size)];
	return (
		<ul tw="flex space-x-3">
			{steps.map((_, index) => (
				<StepStyled key={index} isActive={props.activeIndex! >= index + 1} />
			))}
		</ul>
	);
};

StepIndicator.defaultProps = {
	activeIndex: 1,
	size: 2,
};
