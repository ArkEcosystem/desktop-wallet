import React from "react";

type ClipboardProps = {
	data: string | object;
	children: React.ReactNode;
	onSuccess?: () => void;
	onError?: () => void;
};

export const Clipboard = ({ data, children, onSuccess, onError }: ClipboardProps) => {
	if (!children) {
		return null;
	}

	if (typeof data !== "string") {
		data = JSON.stringify(data);
	}

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(data as string);

			if (onSuccess) {
				onSuccess();
			}
		} catch {
			if (onError) {
				onError();
			}
		}
	};

	return (
		<div data-testid="clipboard__wrapper" className="inline-block cursor-pointer" onClick={onCopy}>
			{children}
		</div>
	);
};

Clipboard.defaultProps = {
	data: "",
};
