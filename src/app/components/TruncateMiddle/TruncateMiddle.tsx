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

export const TruncateMiddle = React.forwardRef(({ text, maxChars, showTooltip, ...properties }: Properties, reference) => {
	const result = React.useMemo(() => {
		if (!maxChars || text.length <= maxChars) {
			return text;
		}

		const midPos = Math.floor(maxChars / 2) - 2;
		const start = text.slice(0, Math.max(0, midPos));
		const end = text.substr(text.length - midPos, text.length);

		return `${start}…${end}`;
	}, [maxChars, text]);

	return (
		<Tooltip content={text} disabled={!showTooltip}>
			<Wrapper ref={reference} data-testid="TruncateMiddle" {...properties}>
				{result}
			</Wrapper>
		</Tooltip>
	);
});

TruncateMiddle.displayName = "TruncateMiddle";

TruncateMiddle.defaultProps = {
	maxChars: 16,
	showTooltip: true,
};
