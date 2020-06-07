import React from "react";
import tw, { styled } from "twin.macro";
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
			<svg tw="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
				<path
					fill="currentColor"
					d="M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z"
				/>
			</svg>
		</StateStyle>
	);
};

export const CardControl = React.forwardRef<HTMLInputElement, CardControlProps>(
	({ children, type, checked, defaultChecked, readOnly, value, name, ...props }: CardControlProps, ref) => {
		return (
			<label tw="cursor-pointer" {...props}>
				<Input
					ref={ref}
					type={type}
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
