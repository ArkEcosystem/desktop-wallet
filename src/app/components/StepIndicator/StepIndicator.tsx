import React from "react";
import tw, { css, styled } from "twin.macro";

type StepIndicatorProps = {
	activeIndex?: number;
	size?: number;
};

const StepStyled = styled.li<{ isActive: boolean }>`
	${tw`flex-1 rounded-lg transition-colors duration-300`}
	height: 2px;
	${({ isActive }) =>
		isActive
			? css`
					${tw`bg-theme-warning-300`}
			  `
			: css`
					${tw`bg-theme-primary-100 dark:bg-theme-secondary-800`}
			  `}
`;

const StepWrapper = styled.ul`
	${tw`flex space-x-3`}
`;

export const StepIndicator: React.FC<StepIndicatorProps> = (props: StepIndicatorProps) => {
	const steps = [...Array(props.size)];
	return (
		<StepWrapper>
			{steps.map((_, index) => (
				<StepStyled key={index} isActive={props.activeIndex! >= index + 1} />
			))}
		</StepWrapper>
	);
};

StepIndicator.defaultProps = {
	activeIndex: 1,
	size: 2,
};
