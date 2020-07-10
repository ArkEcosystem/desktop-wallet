import React from "react";
import tw, { styled } from "twin.macro";

type Props = {
	children: React.ReactNode;
	type?: "radio" | "checkbox";
	name?: string | number;
	value?: string | number;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
} & React.HTMLProps<any>;

const Input = styled.input`
	${tw`sr-only`}
`;

const CustomButton = styled.div`
	${tw`p-2 px-5 font-semibold text-center transition-colors duration-200 border-2 rounded-md border-theme-primary-contrast text-theme-primary-light`}
	${Input}:checked + & {
		${tw`border-theme-success text-theme-success`}
	}
`;

export const SelectCategory = React.forwardRef<HTMLInputElement, Props>(
	({ children, type, name, value, checked, defaultChecked, disabled, onChange, ...props }: Props, ref) => (
		<label htmlFor={name} tw="cursor-pointer" {...props}>
			<Input
				data-testid={`SelectCategory__${name}`}
				ref={ref}
				type={type}
				name={name}
				value={value}
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				onChange={onChange}
			/>
			<CustomButton>{children}</CustomButton>
		</label>
	),
);

SelectCategory.displayName = "SelectCategory";
SelectCategory.defaultProps = {
	type: "checkbox",
};
