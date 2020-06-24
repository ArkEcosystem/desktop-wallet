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
	<div className="flex flex-col mt-3 ml-3">
		<div className="flex items-center text-theme-neutral-500">
			<Icon name="ReplyArrow" />
			<div className="grid grid-cols-2 divide-x">
				<span className="px-3 text-theme-neutral-900">Developer response</span>
				<span className="px-3">{getDateDifferenceFromNow(date)}</span>
			</div>
		</div>
		<ReplyContent className="mt-2 ml-7 text-theme-neutral-600" dangerouslySetInnerHTML={{ __html: content }} />
	</div>
);
