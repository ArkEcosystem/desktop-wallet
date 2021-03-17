import { Input } from "app/components/Input";
import cn from "classnames";
import React from "react";

type InputDefaultProps = {
	className?: string;
} & React.InputHTMLAttributes<any>;

export const InputDefault = React.forwardRef<HTMLInputElement, InputDefaultProps>(
	({ className, ...props }: InputDefaultProps, ref) => <Input className={cn(className)} ref={ref} {...props} />,
);

InputDefault.displayName = "InputDefault";
