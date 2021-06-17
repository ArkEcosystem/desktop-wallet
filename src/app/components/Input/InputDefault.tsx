import { Input } from "app/components/Input";
import cn from "classnames";
import React from "react";

type InputDefaultProperties = {
	className?: string;
} & React.InputHTMLAttributes<any>;

export const InputDefault = React.forwardRef<HTMLInputElement, InputDefaultProperties>(
	({ className, ...properties }: InputDefaultProperties, reference) => <Input className={cn(className)} ref={reference} {...properties} />,
);

InputDefault.displayName = "InputDefault";
