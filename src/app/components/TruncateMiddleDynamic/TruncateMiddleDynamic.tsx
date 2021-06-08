import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useCallback, useState } from "react";

import { useTextTruncate } from "./use-text-truncate";

type Props = {
	value: string;
	offset?: number;
	parentRef?: React.RefObject<HTMLElement>;
} & React.HTMLProps<any>;

export const TruncateMiddleDynamic = ({ value, offset = 0, className, parentRef, ...props }: Props) => {
	const [ref, setRef] = useState<HTMLElement | undefined>();

	const truncated = useTextTruncate(parentRef?.current || ref, value, offset);

	const callbackRef = useCallback((node) => {
		setRef(node);
	}, []);

	return (
		<Tooltip content={value} disabled={truncated === value}>
			<span ref={callbackRef} className={cn("inline-flex overflow-hidden", className)} {...props}>
				{truncated}
			</span>
		</Tooltip>
	);
};
