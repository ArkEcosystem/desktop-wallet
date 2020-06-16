import { Icon } from "app/components/Icon";
import React, { useRef } from "react";
import tw, { css, styled } from "twin.macro";

type ClipboardProps = {
	data: string;
	children: React.ReactNode;
	onSuccess?: any;
	onError?: any;
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
	const textAreaRef = useRef(null);

	const onCopy = () => {
		try {
			textAreaRef.current.select();
			document.execCommand("copy");
			onSuccess();
		} catch {
			onError();
		}
	};

	return (
		<>
			<div className="inline-block cursor-pointer" onClick={onCopy}>
				{children}
			</div>

			<TextArea ref={textAreaRef} value={data} />
		</>
	);
};
