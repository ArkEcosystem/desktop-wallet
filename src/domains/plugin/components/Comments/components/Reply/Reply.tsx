import { Icon } from "app/components/Icon";
import { TimeAgo } from "app/components/TimeAgo";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ReplyContent = styled.div`
	a {
		color: #067cff;
	}
`;

type ReplyProps = {
	date: string;
	content: string;
};

export const Reply = ({ date, content }: ReplyProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col mt-3">
			<div className="flex items-center text-theme-neutral-light">
				<div className="flex items-center w-10">
					<Icon className="mx-auto -mt-2" name="ReplyArrow" width={15} height={18} />
				</div>

				<div className="flex items-center space-x-3 divide-x divide-theme-neutral-light">
					<span className="text-lg font-semibold text-theme-text">{t("PLUGINS.DEVELOPER_RESPONSE")}</span>

					<span className="pl-3 text-sm font-semibold text-theme-neutral">
						<TimeAgo date={date} />
					</span>
				</div>
			</div>

			<ReplyContent className="mt-2 ml-10 text-theme-neutral-600" dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
};
