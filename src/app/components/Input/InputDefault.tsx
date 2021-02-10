import { Input } from "app/components/Input";
import { InputGroup } from "app/components/Input";
import cn from "classnames";
import React from "react";

import { useFormField } from "../Form/useFormField";

type InputDefaultProps = {
	className?: string;
} & React.InputHTMLAttributes<any>;

export const InputDefault = React.forwardRef<HTMLInputElement, InputDefaultProps>(
	({ className, ...props }: InputDefaultProps, ref) => {
		const fieldContext = useFormField();

		return (
			<InputGroup>
				<Input className={cn(className, { "pr-12": fieldContext?.isInvalid })} ref={ref} {...props} />
			</InputGroup>
		);
	},
);

InputDefault.displayName = "InputDefault";
