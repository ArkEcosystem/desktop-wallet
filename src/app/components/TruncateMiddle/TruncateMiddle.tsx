import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { styled } from "twin.macro";

type Props = {
	text: string;
	maxChars?: number;
	as?: React.ElementType;
	showTooltip?: boolean;
} & React.HTMLProps<any>;

const Wrapper = styled.span``;

export const TruncateMiddle = React.forwardRef(({ text, maxChars, showTooltip, ...props }: Props, ref) => {
	const result = React.useMemo(() => {
		if (!maxChars || text.length <= maxChars) {
			return text;
		}

		const midPos = Math.floor(maxChars / 2) - 2;
		const start = text.substr(0, midPos);
		const end = text.substr(text.length - midPos, text.length);

		return `${start}…${end}`;
	}, [maxChars, text]);

	return (
		<Tooltip content={text} disabled={!showTooltip}>
			<Wrapper ref={ref} data-testid="TruncateMiddle" {...props}>
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
