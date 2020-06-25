import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useState } from "react";

import { Pagination } from "./components/Pagination";
import { Reply } from "./components/Reply";
import { getDateDifferenceFromNow } from "./utils";

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
					<div className="flex flex-col mt-5 text-sm" key={idx}>
						<div className="w-2/4">
							<div className="grid grid-cols-3 divide-x divide-theme-neutral-400">
								<div>
									<span className="text-base font-semibold">{author}</span>
								</div>
								<div className="flex items-center justify-center text-theme-warning-300">
									<Icon name="Star" width={10} height={10} />
									<span className="flex px-2 text-theme-neutral-600">{score}</span>
								</div>
								<div className="px-3">
									<span className="text-theme-neutral-400">{getDateDifferenceFromNow(date)}</span>
								</div>
							</div>
						</div>
						<div className="mt-2 w-11/12">
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
