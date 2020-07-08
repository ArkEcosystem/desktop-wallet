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
	${tw`p-6 transition-colors duration-200 border-2 rounded-lg border-theme-primary-contrast`}
	${Input}:checked + & {
		${tw`bg-theme-success-contrast border-theme-success text-theme-success-contrast`}
	}
`;

export const CategoryControl = React.forwardRef<HTMLInputElement, Props>(
	({ children, type, checked, defaultChecked, onChange, readonly, value, name, ...props }: Props, ref) => (
		<label htmlFor={name}>
			<Input
				data-testid={`CategoryControl__${name}`}
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

CategoryControl.displayName = "CategoryControl";
CategoryControl.defaultProps = {
	type: "checkbox",
};
