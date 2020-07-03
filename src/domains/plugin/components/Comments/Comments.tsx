import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Pagination } from "app/components/Pagination";
import React, { useState } from "react";

import { Reply } from "./components/Reply";
import { TimeAgo } from "./components/TimeAgo";

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
		voteDiffColor = "text-theme-neutral-400";
	} else {
		voteDiffColor = voteDiff > 0 ? "text-theme-success-600" : "text-theme-danger-600";
	}

	return (
		<div className="flex items-center space-x-2 font-semibold">
			<span className={voteDiffColor}>{voteDiff}</span>
			<Icon className="text-theme-primary-200" name="ChevronUp" width={15} height={15} />
			<Icon className="text-theme-primary-200" name="ChevronDown" width={15} height={15} />
		</div>
	);
};

export const Comments = ({ comments, sortOptions }: CommentsProps) => {
	const [sortBy, setSortBy] = useState(sortOptions);

	return (
		<div className="w-full">
			<div className="flex items-center mt-5 text-sm text-theme-neutral-900">
				<span className="font-semibold">Sort by:</span>
				<div className="flex items-center ml-2">
					{["Best", "Date", "Most Popular"].map((sortType: string, index: number) => (
						<span className="cursor-pointer" key={index}>
							{index > 0 && <Divider type="vertical" />}

							{sortBy.type === sortType ? (
								<span className="flex items-center font-semibold space-x-2">
									<span>{sortType}</span>{" "}
									<Icon name={sortBy.direction === "asc" ? "ArrowUp" : "ArrowDown"} />
								</span>
							) : (
								<span>{sortType}</span>
							)}
						</span>
					))}
				</div>
			</div>
			<div>
				{comments.map(({ author, score, date, comment, votes, replies }, index: number) => (
					<div className="flex flex-col mt-5" key={index}>
						<div className="flex items-center justify-between">
							<div className="relative flex items-center space-x-3 divide-theme-neutral-400">
								<span className="text-lg font-semibold">{author}</span>

								<Divider type="vertical" />

								<div className="flex items-center text-sm font-semibold text-theme-warning-300">
									<Icon name="Star" width={10} height={10} />
									<span className="ml-1 text-theme-neutral-600">{score}</span>
								</div>

								<Divider type="vertical" />

								<span className="text-sm font-semibold text-theme-neutral-400">
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
