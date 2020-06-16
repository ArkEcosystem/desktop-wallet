import React from "react";
import tw, { styled } from "twin.macro";

import { Icon } from "../Icon";
import { Card } from "./Card";

type CardControlProps = {
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

const CustomCard = styled(Card)`
	${tw`transition-colors duration-200`}
	${Input}:checked + & {
		${tw`bg-theme-success-contrast border-theme-success`}
	}
`;

const StateStyle = styled.div`
    ${tw`rounded-full w-4 h-4 border-2 border-theme-primary-contrast inline-flex items-center justify-center text-transparent`}
    ${Input}:checked + ${CustomCard} & {
        ${tw`bg-theme-success border-transparent text-theme-success-contrast`}
    }
`;

export const CardControlState = () => {
	return (
		<StateStyle data-testid="card__control-state">
			<Icon name="Checkmark" />
		</StateStyle>
	);
};

export const CardControl = React.forwardRef<HTMLInputElement, CardControlProps>(
	({ children, type, checked, defaultChecked, onChange, readOnly, value, name, ...props }: CardControlProps, ref) => {
		return (
			<label tw="cursor-pointer" {...props}>
				<Input
					data-testid={`card-control__${name}`}
					ref={ref}
					type={type}
					checked={checked}
					onChange={onChange}
					defaultChecked={defaultChecked}
					readOnly={readOnly}
					value={value}
					name={name}
				/>
				<CustomCard>{children}</CustomCard>
			</label>
		);
	},
);

CardControl.displayName = "CardControl";
CardControl.defaultProps = {
	type: "checkbox",
};
