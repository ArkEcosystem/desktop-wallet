import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useCallback, useState } from "react";

import { useTextTruncate } from "./use-text-truncate";

type Properties = {
	value: string;
	offset?: number;
	parentRef?: React.RefObject<HTMLElement>;
} & React.HTMLProps<any>;

export const TruncateMiddleDynamic = ({ value, offset = 0, className, parentRef, ...properties }: Properties) => {
	const [reference, setReference] = useState<HTMLElement | undefined>();

	const truncated = useTextTruncate(parentRef?.current || reference, value, offset);

	const callbackReference = useCallback((node) => {
		setReference(node);
	}, []);

	return (
		<Tooltip content={value} disabled={truncated === value}>
			<span ref={callbackReference} className={cn("inline-flex overflow-hidden", className)} {...properties}>
				{truncated}
			</span>
		</Tooltip>
	);
};
