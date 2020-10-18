import { Icon } from "app/components/Icon";
import { Pagination } from "app/components/Pagination";
import { TimeAgo } from "app/components/TimeAgo";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Reply } from "./components/Reply";

type Comment = {
	author: string;
	score: string;
	comment: string;
	date: string;
	votes: any;
	replies?: any;
};

type CommentsProps = {
	comments: Comment[];
	sortOptions: any;
};

const Votes = ({ votes }: any) => {
	const voteDiff = votes.up - votes.down;

	let voteDiffColor;

	if (voteDiff === 0) {
		voteDiffColor = "text-theme-neutral-light";
	} else {
		voteDiffColor = voteDiff > 0 ? "text-theme-success" : "text-theme-danger-dark";
	}

	return (
		<div className="flex items-center space-x-2 font-semibold">
			<span className={voteDiffColor}>{voteDiff > 0 ? `+${voteDiff}` : voteDiff}</span>
			<Icon className="text-theme-primary-light" name="ChevronUp" width={15} height={15} />
			<Icon className="text-theme-primary-light" name="ChevronDown" width={15} height={15} />
		</div>
	);
};

export const Comments = ({ comments, sortOptions }: CommentsProps) => {
	const [sortBy] = useState(sortOptions);

	const { t } = useTranslation();

	const transformType = (type: string) => type.replace(" ", "_").toUpperCase();

	return (
		<div className="w-full">
			<div className="flex items-center mt-5 text-sm font-semibold text-theme-neutral">
				<span className="text-theme-text">{t("COMMON.SORT_BY")}:</span>
				<div className="flex items-center ml-2 space-x-3 divide-x divide-theme-neutral-light">
					{["Best", "Date", "Most Popular"].map((sortType: string, index: number) => (
						<span className={`cursor-pointer ${index > 0 ? "pl-3" : null}`} key={index}>
							{sortBy.type === sortType ? (
								<span className="flex items-center space-x-1 text-theme-text">
									<span>{t(`COMMON.${transformType(sortType)}`)}</span>
									<Icon
										name={sortBy.direction === "asc" ? "ChevronUp" : "ChevronDown"}
										width={7}
										height={5}
									/>
								</span>
							) : (
								<span>{t(`COMMON.${transformType(sortType)}`)}</span>
							)}
						</span>
					))}
				</div>
			</div>
			<div>
				{comments.map(({ author, score, date, comment, votes, replies }, index: number) => (
					<div className="flex flex-col mt-5" key={index}>
						<div className="flex items-center justify-between">
							<div className="relative flex items-center divide-x divide-theme-neutral-light">
								<span className="pr-3 text-lg font-semibold">{author}</span>

								<div className="flex items-center px-3 text-sm font-semibold text-theme-warning-400">
									<Icon name="Star" width={10} height={10} />
									<span className="ml-1 text-theme-secondary-text">{score}</span>
								</div>

								<span className="pl-3 text-sm font-semibold text-theme-neutral">
									<TimeAgo date={date} />
								</span>
							</div>

							<Votes votes={votes} />
						</div>

						<div className="mt-2">
							<p className="text-theme-neutral-600">{comment}</p>
							{replies &&
								replies.map((reply: any, index: number) => (
									<Reply key={`reply-${index}`} date={reply.date} content={reply.content} />
								))}
						</div>
					</div>
				))}
			</div>
			<div className="mt-7">
				<Pagination totalCount={12} itemsPerPage={4} onSelectPage={console.log} currentPage={1} />
			</div>
		</div>
	);
};
