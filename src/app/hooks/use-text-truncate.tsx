import { TruncateMiddle } from "app/components/TruncateMiddle";
import cls from "classnames";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import React from "react";

type Props = {
	text?: string;
	parentRef: React.RefObject<HTMLElement>;
	minChars?: number;
};

export const useTextTruncate = ({ text = "", minChars = 10, parentRef }: Props) => {
	const textNodeRef = useRef<HTMLElement>();
	const textLength = text.length;
	const [maxChars, setMaxChars] = useState(text.length);

	const fullWidth = useRef<any>();

	const calculateOffsets = useCallback(() => {
		if (!textNodeRef.current || !parentRef?.current) {
			return;
		}

		if (!fullWidth.current) {
			fullWidth.current = textNodeRef.current.offsetWidth;
		}

		const parentWidth = parentRef.current.offsetWidth;
		const textWidth = fullWidth.current;

		if (textWidth > parentWidth) {
			const overflowSize = textWidth - parentWidth;
			const letterSize = textWidth / textLength;
			const maxChars = textLength - overflowSize / letterSize;

			setMaxChars(Math.max(maxChars, minChars));

			return;
		}

		setMaxChars(textLength);
	}, [textLength, parentRef, minChars]);

	useLayoutEffect(() => {
		calculateOffsets();
	}, [calculateOffsets]);

	useEffect(() => {
		const listener = () => calculateOffsets();
		window.addEventListener("resize", listener);

		return () => {
			window.removeEventListener("resize", listener);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const Component = useCallback(
		({ className, ...props }: Omit<React.ComponentProps<typeof TruncateMiddle>, "text" | "maxChars">) => (
			<TruncateMiddle
				ref={textNodeRef}
				maxChars={maxChars}
				text={text}
				className={cls("whitespace-nowrap", className)}
				{...props}
			/>
		),
		[maxChars, text],
	);

	return [Component];
};
