import { Icon } from "app/components/Icon";
import React from "react";

import { getDateDifferenceFromNow } from "../../utils";

export const Reply = ({
	replyDate = "2020-06-19T14:48:00.000Z",
	reply = "HSIUAHDIUSHDIUASHDIUASHDIHSAIDUHSAIUDHSA",
}: ReplyProps) => (
	<div className="flex flex-col">
		<div className="flex items-center text-theme-neutral-500">
			<Icon name="ReplyArrow" />
			<div className="grid grid-cols-2 divide-x">
				<span className="font-bold text-theme-neutral-900 px-3">Developer response</span>
				<span className="px-3">{getDateDifferenceFromNow(replyDate)}</span>
			</div>
		</div>
		<span className="ml-7 mt-2 text-theme-neutral-600">{reply}</span>
	</div>
);
