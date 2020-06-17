import { Icon } from "app/components/Icon";
import React, { useRef } from "react";
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
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	if (!children) {
		return null;
	}

	const onCopy = () => {
		try {
			const node = textAreaRef.current;

			if (node) {
				node.select();
				document.execCommand("copy");

				if (onSuccess) {
					onSuccess();
				}
			}
		} catch (error) {
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
