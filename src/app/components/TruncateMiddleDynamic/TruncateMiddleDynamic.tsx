import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useLayoutEffect, useRef, useState } from "react";

import { useTextTruncate } from "./hooks";

type Props = {
	value: string;
	offset?: number;
	parentRef?: React.RefObject<HTMLElement>;
} & React.HTMLProps<any>;

export const TruncateMiddleDynamic = ({ value, offset = 0, className, parentRef, ...props }: Props) => {
	const [truncated, setTruncated] = useState<string | undefined>(value);

	const ref = useRef<HTMLElement>(null);

	const truncate = useTextTruncate();

	useLayoutEffect(() => {
		setTruncated(truncate(value, offset, parentRef?.current || ref.current));
	}, [offset, parentRef, truncate, value]);

	return (
		<Tooltip content={value} disabled={truncated === value}>
			<span ref={ref} className={cn("inline-flex overflow-hidden", className)} {...props}>
				{truncated}
			</span>
		</Tooltip>
	);
};
