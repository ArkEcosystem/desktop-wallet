import React from "react";
import tw, { styled } from "twin.macro";

type Props = {
	children: React.ReactNode;
	type?: "radio" | "checkbox";
	checked?: boolean;
	defaultChecked?: boolean;
	readonly?: boolean;
	value?: string | number;
	name?: string | number;
} & React.HTMLProps<any>;

const Input = styled.input`
	${tw`sr-only`}
`;

export const CategoryControl = React.forwardRef<HTMLInputElement, Props>(
	({ children, type, checked, defaultChecked, readonly, value, name, ...props }: Props, ref) => (
		<label htmlFor={name} />
	),
);

CategoryControl.displayName = "CategoryControl";
CategoryControl.defaultProps = {
	type: "checkbox",
};
