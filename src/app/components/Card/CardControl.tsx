import { Icon } from "app/components/Icon";
import React from "react";
import tw, { styled } from "twin.macro";

import { Card } from "./Card";

type CardControlProps = {
	children: React.ReactNode;
	type?: "radio" | "checkbox";
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	value?: string | number;
	name?: string | number;
} & React.HTMLProps<any>;

const Input = styled.input`
	${tw`sr-only`}
`;

const CustomCard = styled(Card)`
	${tw`transition-colors duration-200`}
	${Input}:checked + & {
		${tw`bg-theme-success-100 border-theme-success-600`}
	}
	${Input}:disabled + & {
		${tw`cursor-not-allowed`}
	}
`;

const StateStyle = styled.div`
	${tw`inline-flex items-center justify-center w-4 h-4 text-transparent border-2 rounded-full border-theme-primary-100 dark:border-theme-secondary-800`}
	${Input}:checked + ${CustomCard} & {
		${tw`border-transparent bg-theme-success-600 text-theme-success-100`}
	}
`;

export const CardControlState = () => (
	<StateStyle data-testid="card__control-state">
		<Icon name="Checkmark" />
	</StateStyle>
);

export const CardControl = React.forwardRef<HTMLInputElement, CardControlProps>(
	({ children, type, checked, defaultChecked, onChange, disabled, value, name, ...props }: CardControlProps, ref) => (
		<label tw="cursor-pointer" {...props}>
			<Input
				data-testid={`card-control__${name}`}
				ref={ref}
				type={type}
				checked={checked}
				onChange={onChange}
				defaultChecked={defaultChecked}
				disabled={disabled}
				value={value}
				name={name}
			/>
			<CustomCard>{children}</CustomCard>
		</label>
	),
);

CardControl.displayName = "CardControl";
CardControl.defaultProps = {
	type: "checkbox",
};
