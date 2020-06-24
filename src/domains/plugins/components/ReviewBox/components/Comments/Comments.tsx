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
};

type CommentsProps = {
	comments: Comment[];
	sortOptions: any;
};

type SorterPropsProps = {
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
			<p className="font-bold text-xl">Reviews ARK Explorer</p>
			<div className="flex mt-5 items-center text-sm text-theme-neutral-900 font-semibold">
				<span>Sort by:</span>
				<div className="flex items-center">
					<span className="ml-2">{sortBy.label}</span>
					<Sorter options={sortOptions} handleSortBy={setSortBy} />
				</div>
			</div>
			<div>
				{comments.map(({ author, score, date, comment, replies }, idx) => (
					<div className="w-2/3 mt-5 flex flex-col text-sm" key={idx}>
						<div className="w-1/2">
							<div className="grid grid-cols-3 divide-x divide-theme-neutral-400">
								<div>
									<span className="text-base">{author}</span>
								</div>
								<div className="flex items-center justify-center text-theme-warning-300">
									<Icon name="Star" width={10} height={10} />
									<span className="px-3 flex text-theme-neutral-600">{score}</span>
								</div>
								<div className="px-3">
									<span className="text-theme-neutral-400">{getDateDifferenceFromNow(date)}</span>
								</div>
							</div>
						</div>
						<div className="mt-2">
							<p className="text-theme-neutral-600">{comment}</p>
							{replies &&
								replies.map((reply, index) => (
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
