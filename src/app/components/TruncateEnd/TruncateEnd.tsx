import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { styled } from "twin.macro";

type Properties = {
	text: string;
	maxChars?: number;
	as?: React.ElementType;
	showTooltip?: boolean;
} & React.HTMLProps<any>;

const Wrapper = styled.span``;

export const TruncateEnd = ({ text, maxChars, showTooltip, ...properties }: Properties) => {
	const result = React.useMemo(() => {
		if (!maxChars || text.length <= maxChars) {
			return text;
		}

		const start = text.slice(0, Math.max(0, maxChars));

		return `${start}…`;
	}, [maxChars, text]);

	return (
		<Tooltip content={text} disabled={!showTooltip}>
			<Wrapper data-testid="TruncateEnd" {...properties}>
				{result}
			</Wrapper>
		</Tooltip>
	);
};

TruncateEnd.defaultProps = {
	maxChars: 16,
	showTooltip: true,
};
