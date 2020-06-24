import { Icon } from "app/components/Icon";
import React from "react";
import styled from "styled-components";

import { getDateDifferenceFromNow } from "../../utils";

const ReplyContent = styled.div`
	a {
		color: #067cff;
	}
`;

type ReplyProps = {
	date: string;
	content: string;
};

export const Reply = ({ date, content }: ReplyProps) => (
	<div className="mt-3 ml-3 flex flex-col">
		<div className="flex items-center text-theme-neutral-500">
			<Icon name="ReplyArrow" />
			<div className="grid grid-cols-2 divide-x">
				<span className="font-bold text-theme-neutral-900 px-3">Developer response</span>
				<span className="px-3">{getDateDifferenceFromNow(date)}</span>
			</div>
		</div>
		<ReplyContent className="ml-7 mt-2 text-theme-neutral-600" dangerouslySetInnerHTML={{ __html: content }} />
	</div>
);
