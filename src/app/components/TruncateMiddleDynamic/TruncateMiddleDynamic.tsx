import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useRef } from "react";

import { useTextTruncate } from "./use-text-truncate";

type Props = {
	value: string;
	offset?: number;
	parentRef?: React.RefObject<HTMLElement>;
} & React.HTMLProps<any>;

export const TruncateMiddleDynamic = ({ value, offset = 0, className, parentRef, ...props }: Props) => {
	const ref = useRef<HTMLElement>(null);

	const truncated = useTextTruncate(parentRef?.current || ref.current, value, offset);

	return (
		<Tooltip content={value} disabled={truncated === value}>
			<span ref={ref} className={cn("inline-flex overflow-hidden", className)} {...props}>
				{truncated}
			</span>
		</Tooltip>
	);
};
