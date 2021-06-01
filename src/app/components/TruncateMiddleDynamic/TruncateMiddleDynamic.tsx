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

	const lengthRef = useRef(value.length);

	const [truncated, setTruncated] = useState(value);

	const hasOverflow = useCallback(
		(element: HTMLElement, parent?: any) => (parent?.offsetWidth || element.offsetWidth) - offset < element.scrollWidth,
		[offset],
	);

	const truncate = useCallback(() => {
		console.log("truncate");
		if (!ref?.current || truncated.length < 16) {
			return;
		}

		if (!hasOverflow(ref.current, parentRef?.current)) {
			return truncated;
		}

		const length = lengthRef.current;

		const prefix = value.substr(0, Math.floor(length / 2));
		const suffix = value.substr(-(length - Math.floor(length / 2)));

		lengthRef.current--;

		console.log(truncated);
		setTruncated(`${prefix}…${suffix}`);
	}, [hasOverflow, value, truncated, parentRef]);

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
