import React, { useEffect } from "react";

import { Input } from "../Input";

type TextareaProperties = { isInvalid?: boolean; palceholder?: string } & React.TextareaHTMLAttributes<any>;

export const TextArea = React.forwardRef((properties: TextareaProperties, reference: any) => {
	useEffect(() => {
		const current = reference?.current;
		if (current) {
			current.style.height = "auto";
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			current.style.height = `${current.scrollHeight + 4}px`;
		}
	}, [reference, properties.value]);

	return <Input data-testid="TextArea" as="textarea" isTextArea ref={reference} {...properties} />;
});

TextArea.displayName = "TextArea";
