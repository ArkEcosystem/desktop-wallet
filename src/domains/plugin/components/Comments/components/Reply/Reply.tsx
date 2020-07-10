import { Icon } from "app/components/Icon";
import React from "react";
import styled from "styled-components";

import { TimeAgo } from "../TimeAgo";

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
	<div className="flex flex-col mt-3">
		<div className="flex items-center text-theme-neutral-light">
			<div className="flex items-center w-10">
				<Icon className="mx-auto -mt-2" name="ReplyArrow" width={15} height={18} />
			</div>

			<div className="flex items-center divide-x divide-theme-neutral-light space-x-3">
				<span className="text-lg font-semibold text-theme-neutral-900">Developer response</span>

				<span className="pl-3 text-sm font-semibold text-theme-neutral">
					<TimeAgo date={date} />
				</span>
			</div>
		</div>

		<ReplyContent className="mt-2 ml-10 text-theme-neutral-600" dangerouslySetInnerHTML={{ __html: content }} />
	</div>
);
