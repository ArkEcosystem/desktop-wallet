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

export const TruncateEnd = ({ text, maxChars, showTooltip, ...props }: Props) => {
	const result = React.useMemo(() => {
		if (!maxChars || text.length <= maxChars) {
			return text;
		}

		const start = text.substr(0, maxChars);

		return `${start}…`;
	}, [maxChars, text]);

	return (
		<Tooltip content={text} disabled={!showTooltip}>
			<Wrapper data-testid="TruncateEnd" {...props}>
				{result}
			</Wrapper>
		</Tooltip>
	);
};

TruncateEnd.defaultProps = {
	maxChars: 16,
	showTooltip: true,
};
