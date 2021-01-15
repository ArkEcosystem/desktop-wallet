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
		padding: 0.6875rem 1.25rem 0.625rem;
	}
	&[aria-checked="true"] {
		${tw`text-theme-success-600 border-theme-success-600 bg-theme-success-100 font-semibold`}
	}
	& + &:after {
		content: "";
		width: 1px;
		${tw`bg-theme-secondary-300 top-1/2 absolute left-0 block h-6 transform -translate-y-1/2`};
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
			className="relative px-5 border-transparent transition-colors duration-300 focus:outline-none border-b-3"
		>
			{children}
		</SelectionBarOptionStyled>
	);
};
