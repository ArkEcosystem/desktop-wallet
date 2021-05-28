import { TruncateMiddle } from "app/components/TruncateMiddle";
import cls from "classnames";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import React from "react";

interface Props {
	text?: string;
	parentRef: React.RefObject<HTMLElement>;
	minChars?: number;
	extraSpace?: number;
}

type TruncateComponentProps = Omit<React.ComponentProps<typeof TruncateMiddle>, "text" | "maxChars">;

export const useTextTruncate = ({ text = "", minChars = 10, extraSpace = 5, parentRef }: Props) => {
	const textNodeRef = useRef<HTMLElement>(null);
	const textLength = text.length;
	const [maxChars, setMaxChars] = useState(text.length);

	const textWidthRef = useRef<number>();

	const calculateOffsets = useCallback(() => {
		/* istanbul ignore next */
		if (!textNodeRef.current || !parentRef?.current) {
			return;
		}

		const currentTextWidth = textNodeRef.current.offsetWidth;

		if (!textWidthRef.current) {
			textWidthRef.current = currentTextWidth;
		}

		const parentWidth = parentRef.current.offsetWidth;
		const textWidth: number = textWidthRef.current;

		if (textWidth > parentWidth) {
			const overflowSize = textWidth + extraSpace - parentWidth;
			const letterSize = textWidth / textLength;
			const maxChars = textLength - overflowSize / letterSize;

			setMaxChars(Math.max(maxChars, minChars));

			return;
		}

		setMaxChars(textLength);
	}, [textLength, parentRef, extraSpace, minChars]);

	useLayoutEffect(() => {
		calculateOffsets();
	}, [calculateOffsets]);

	useEffect(() => {
		window.addEventListener("resize", calculateOffsets);

		return () => {
			window.removeEventListener("resize", calculateOffsets);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const Component = useCallback(
		({ className, ...props }: TruncateComponentProps) => (
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

	return [Component, textNodeRef] as [typeof Component, React.RefObject<HTMLElement>];
};
