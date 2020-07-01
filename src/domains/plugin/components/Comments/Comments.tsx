import { Divider } from "app/components/Divider";
import { Dropdown } from "app/components/Dropdown";
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
	replies?: any;
};

type CommentsProps = {
	comments: Comment[];
	sortOptions: any;
};

type SorterProps = {
	handleSortBy: any;
	options: any;
};

const Sorter = ({ handleSortBy, options }: SorterProps) => {
	return (
		<div className="ml-1">
			<Dropdown
				position="left"
				toggleIcon="ArrowDown"
				toggleSize="small"
				options={options}
				onSelect={(option: any) => handleSortBy(option)}
			/>
		</div>
	);
};

export const Comments = ({ comments, sortOptions }: CommentsProps) => {
	const [sortBy, setSortBy] = useState(sortOptions[0]);

	return (
		<div className="w-full">
			<p className="text-xl font-bold">Reviews ARK Explorer</p>
			<div className="flex items-center mt-5 text-sm font-semibold text-theme-neutral-900">
				<span>Sort by:</span>
				<div className="flex items-center">
					<span className="ml-2">{sortBy.label}</span>
					<Sorter options={sortOptions} handleSortBy={setSortBy} />
				</div>
			</div>
			<div>
				{comments.map(({ author, score, date, comment, replies }, idx) => (
					<div className="flex flex-col mt-5" key={idx}>
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

						<div className="w-11/12 mt-2">
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
