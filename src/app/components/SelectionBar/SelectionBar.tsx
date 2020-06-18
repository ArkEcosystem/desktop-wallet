import React from "react";
import tw, { styled } from "twin.macro";

type GroupProps = {
	children?: React.ReactNode;
};

export const SelectionBar = ({ children }: GroupProps) => {
	return (
		<div
			data-testid="SelectionBar"
			role="radiogroup"
			className="border-theme-neutral-300 inline-flex items-center flex-shrink-0 overflow-hidden border rounded shadow-sm"
		>
			{children}
		</div>
	);
};

const SelectionBarOptionStyled = styled.button`
	&[aria-checked="true"] {
		${tw`text-theme-success border-theme-success bg-theme-success-contrast font-semibold`}
	}
	& + &:after {
		content: "";
		width: 1px;
		${tw`bg-theme-neutral-300 top-1/2 absolute left-0 block h-6 transform -translate-y-1/2`};
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
			data-testid="SelectionBarOption"
			role="radio"
			aria-checked={isChecked}
			onClick={() => setCheckedValue(value)}
			className="focus:outline-none border-b-3 relative px-5 py-3 transition-colors duration-300 border-transparent"
		>
			{children}
		</SelectionBarOptionStyled>
	);
};
