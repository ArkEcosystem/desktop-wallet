import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
	value: string;
	offset?: number;
	parentRef?: React.RefObject<HTMLElement>;
} & React.HTMLProps<any>;

export const TruncateMiddleDynamic = ({ value, offset = 0, className, parentRef }: Props) => {
	const ref = useRef<HTMLElement>(null);

	const [truncated, setTruncated] = useState(value);

	const hasOverflow = useCallback(
		(element: HTMLElement, referenceElement: HTMLElement) =>
			referenceElement.offsetWidth - offset < element.offsetWidth,
		[offset],
	);

	const truncate = useCallback(() => {
		if (!ref?.current) {
			return;
		}

		const referenceElement = parentRef?.current || ref.current;

		let length = value.length;

		const element = document.createElement("div");
		element.classList.add("fixed", "invisible", "w-auto", "whitespace-nowrap");

		element.innerHTML = "";
		element.appendChild(document.createTextNode(value));

		referenceElement.appendChild(element);

		let tempTruncated = value;

		if (!hasOverflow(element, referenceElement)) {
			return;
		}

		do {
			const prefix = value.substr(0, Math.floor(length / 2));
			const suffix = value.substr(-(length - Math.floor(length / 2)));

			tempTruncated = `${prefix}…${suffix}`;

			element.innerHTML = "";
			element.appendChild(document.createTextNode(tempTruncated));

			length--;
		} while (hasOverflow(element, referenceElement));

		referenceElement.removeChild(element);

		setTruncated(tempTruncated);
	}, [hasOverflow, value, truncated, parentRef]); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		truncate();
	}, [truncate]);

	useEffect(() => {
		window.addEventListener("resize", truncate);

		return () => {
			window.removeEventListener("resize", truncate);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Tooltip content={value} disabled={truncated === value}>
			<span ref={ref} className={cn("inline-flex overflow-hidden", className)}>
				{truncated}
			</span>
		</Tooltip>
	);
};
