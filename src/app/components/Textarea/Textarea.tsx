import React, { useEffect } from "react";
import { Input } from "../Input";

type TextareaProps = { isInvalid?: boolean } & React.TextareaHTMLAttributes<any>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props: TextareaProps, ref) => {
	useEffect(() => {
		const current = ref?.current;
		if (current) {
			current.style.height = "auto";
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			current.style.height = `${current.scrollHeight + 4}px`;
		}
	}, [props.value]);

	return <Input data-testid="TextArea" as="textarea" ref={ref} {...props} />;
});

TextArea.displayName = "TextArea";
