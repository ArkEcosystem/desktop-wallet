import { useClipboard } from "app/hooks";
import React from "react";

type ClipboardProps = {
	data: string | object;
	options?: any;
	children: React.ReactNode;
};

export const Clipboard = ({ data, options, children }: ClipboardProps) => {
	const [hasCopied, copy] = useClipboard(options);

	if (!children) {
		return null;
	}

	return (
		<div data-testid="clipboard__wrapper" className="inline-block cursor-pointer" onClick={() => copy(data)}>
			{children}
		</div>
	);
};

Clipboard.defaultProps = {
	data: "",
};
