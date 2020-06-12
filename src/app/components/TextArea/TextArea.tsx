import React from "react";
import { Input } from "../Input";

type TextAreaProps = { isInvalid?: boolean } & React.TextareaHTMLAttributes<any>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props: TextAreaProps, ref) => {
	return <Input data-testid="TextArea" as="textarea" ref={ref} {...props} />;
});

TextArea.displayName = "TextArea";
