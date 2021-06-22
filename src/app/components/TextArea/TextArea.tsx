import cn from "classnames";
import React, { useEffect } from "react";

import { Input } from "../Input";

type TextareaProperties = {
	isInvalid?: boolean;
	palceholder?: string;
	initialHeight?: number;
} & React.TextareaHTMLAttributes<any>;

export const TextArea = React.forwardRef(
	({ initialHeight = 100, ...properties }: TextareaProperties, reference: any) => {
		useEffect(() => {
			const current = reference?.current;
			if (current) {
				current.style.height = `${initialHeight}px`;
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				current.style.height = `${current.scrollHeight + 4}px`;
			}
		}, [reference, properties.value, initialHeight]);

		return (
			<Input
				data-testid="TextArea"
				as="textarea"
				isTextArea
				ref={reference}
				{...properties}
				innerClassName={cn({ "resize-none": properties.disabled })}
			/>
		);
	},
);

TextArea.displayName = "TextArea";
