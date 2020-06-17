import React from "react";
import tw, { styled } from "twin.macro";

type GroupProps = {
	children?: React.ReactNode;
};

export const SelectionBarGroup = ({ children }: GroupProps) => {
	return (
		<div
			data-testid="SelectionBarGroup"
			role="radiogroup"
			className="inline-flex items-center flex-shrink-0 overflow-hidden border rounded border-theme-neutral-300 shadow-sm"
		>
			{children}
		</div>
	);
};

const SelectionBarStyled = styled.button`
	&[aria-checked="true"] {
		${tw`text-theme-success border-theme-success bg-theme-success-contrast font-semibold`}
	}
	& + &:after {
		content: "";
		width: 1px;
		${tw`h-6 bg-theme-neutral-300 absolute left-0 top-1/2 transform -translate-y-1/2 block`};
	}
`;

type ButtonProps = {
	children: React.ReactNode;
	value: string | number;
	isValueChecked: (value: string | number) => boolean;
	setCheckedValue: (value: string | number) => void;
};

export const SelectionBar = ({ value, isValueChecked, setCheckedValue, children }: ButtonProps) => {
	const isChecked = isValueChecked(value);

	return (
		<SelectionBarStyled
			data-testid="SelectionBar"
			role="radio"
			aria-checked={isChecked}
			onClick={() => setCheckedValue(value)}
			className="relative px-5 py-3 border-transparent transition-colors duration-300 focus:outline-none border-b-3"
		>
			{children}
		</SelectionBarStyled>
	);
};
