import React from "react";
import tw, { styled } from "twin.macro";

type GroupProps = {
	children?: React.ReactNode;
};

export const SelectionBar = ({ children }: GroupProps) => (
	<div
		data-testid="SelectionBar"
		role="radiogroup"
		className="inline-flex overflow-hidden flex-shrink-0 items-center rounded border border-theme-secondary-300 dark:border-theme-secondary-800"
	>
		{children}
	</div>
);

const SelectionBarOptionStyled = styled.button`
	& {
		${tw`mr-px last:mr-0 text-theme-secondary-900 dark:text-theme-secondary-600`};
	}
	&[aria-checked="true"] {
		-webkit-text-stroke: 0.5px var(--theme-color-success-600);
		${tw`text-theme-success-600 border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900`}
	}
	& + &:after {
		content: "";
		width: 1px;
		${tw`bg-theme-secondary-300 dark:bg-theme-secondary-800 top-1/2 absolute block -left-px h-6 transform -translate-y-1/2`};
	}
`;

type ButtonProps = {
	children: React.ReactNode;
	value: string | number;
	isValueChecked: (value: string | number) => boolean;
	setCheckedValue: (value: string | number) => void;
};

export const SelectionBarOption = ({ value, isValueChecked, setCheckedValue, children }: ButtonProps) => {
	const isChecked = isValueChecked(value);

	return (
		<SelectionBarOptionStyled
			type="button"
			data-testid="SelectionBarOption"
			role="radio"
			aria-checked={isChecked}
			onClick={() => setCheckedValue(value)}
			className="relative items-center px-4 h-full border-transparent transition-colors duration-300 first:pl-6 last:pr-6 focus:outline-none border-b-3"
		>
			{children}
		</SelectionBarOptionStyled>
	);
};
