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

const CustomButton = styled.div`
	${tw`p-2 px-4 font-semibold text-center transition-colors duration-200 border-2 rounded-md border-theme-primary-contrast text-theme-primary-light`}
	${Input}:checked + & {
		${tw`bg-theme-success-contrast border-theme-success text-theme-success`}
	}
`;

export const SelectCategory = React.forwardRef<HTMLInputElement, Props>(
	({ children, type, checked, defaultChecked, onChange, readonly, value, name, ...props }: Props, ref) => (
		<label htmlFor={name} className="cursor-pointer" {...props}>
			<Input
				data-testid={`SelectCategory__${name}`}
				ref={ref}
				type={type}
				checked={checked}
				onChange={onChange}
				defaultChecked={defaultChecked}
				readOnly={readonly}
				value={value}
				name={name}
			/>
			<CustomButton>{children}</CustomButton>
		</label>
	),
);

SelectCategory.displayName = "SelectCategory";
SelectCategory.defaultProps = {
	type: "checkbox",
};
