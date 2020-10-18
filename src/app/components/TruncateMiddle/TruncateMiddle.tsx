import Tippy from "@tippyjs/react";
import React from "react";
import { styled } from "twin.macro";

type Props = {
	text: string;
	maxChars?: number;
	as?: React.ElementType;
	showTooltip?: boolean;
} & React.HTMLProps<any>;

const Wrapper = styled.span``;

export const TruncateMiddle = ({ text, maxChars, showTooltip, ...props }: Props) => {
	const result = React.useMemo(() => {
		if (!maxChars || text.length <= maxChars) {
			return text;
		}

		const midPos = Math.floor(maxChars / 2) - 2;
		const start = text.substr(0, midPos);
		const end = text.substr(text.length - midPos, text.length);

		return `${start} … ${end}`;
	}, [maxChars, text]);

	return (
		<Tippy content={text} disabled={!showTooltip}>
			<Wrapper data-testid="TruncateMiddle" {...props}>
				{result}
			</Wrapper>
		</Tippy>
	);
};

TruncateMiddle.defaultProps = {
	maxChars: 16,
	showTooltip: true,
};
