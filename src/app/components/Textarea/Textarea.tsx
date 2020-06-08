import React from "react";
import { Input } from "../Input";

type TextareaProps = { isInvalid?: boolean } & React.TextareaHTMLAttributes<any>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props: TextareaProps, ref) => {
	return <Input data-testid="Textarea" as="textarea" ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";
