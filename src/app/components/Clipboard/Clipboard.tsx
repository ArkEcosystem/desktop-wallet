import { Icon } from "app/components/Icon";
import React from "react";
import tw, { css, styled } from "twin.macro";

type ClipboardProps = {
	data: string;
	children: React.ReactNode;
	onSuccess?: () => void;
	onError?: () => void;
};

const TextArea = styled.textarea(() => [
	tw`absolute left-0 top-0 w-0 h-0 opacity-0`,
	css`
		& {
			z-index: -9999;
		}
	`,
]);

export const Clipboard = ({ data, children, onSuccess, onError }: ClipboardProps) => {
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	if (!children) {
		return null;
	}

	const onCopy = () => {
		try {
			textAreaRef?.current?.select();
			document.execCommand("copy");

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
		<>
			<div data-testid="clipboard__inner" className="inline-block cursor-pointer" onClick={onCopy}>
				{children}
			</div>

			<TextArea data-testid="clipboard__textarea" ref={textAreaRef} value={data} readOnly={true} />
		</>
	);
};

Clipboard.defaultProps = {
	data: "",
};