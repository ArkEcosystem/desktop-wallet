import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import moment from "moment";
import React, { useState } from "react";

type Comment = {
	author: string;
	score: string;
	comment: string;
	date: string;
};

type CommentsProps = {
	comments: Comment[];
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

export const Comments = ({ comments }: CommentsProps) => {
	const sortOptions = [
		{ label: "Best", value: "best" },
		{ label: "Date", value: "date" },
	];

	const [sortBy, setSortBy] = useState(sortOptions[0]);
	const now = moment();
	console.log({ sortBy });

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
			<div className="mt-5">
				{comments.map(({ author, score, date, comment }, idx) => {
					const commentDate = moment(date);
					const dateDifference = now.diff(commentDate, "days");

					const getDateDifference = () => {
						const dateComplement = dateDifference > 1 ? "days" : "day";

						return `${dateDifference} ${dateComplement} ago`;
					};

					return (
						<div className="flex flex-col text-sm" key={idx}>
							<div className="w-1/2">
								<div className="grid grid-cols-3 divide-x divide-theme-neutral-300">
									<div>
										<span className="font-bold text-sm">{author}</span>
									</div>
									<div className="flex items-center justify-center text-theme-warning-300">
										<Icon name="Star" width={10} height={10} />
										<span className="ml-3 flex text-theme-neutral-500">{score}</span>
									</div>
									<div className="px-3">
										<span className="text-theme-neutral-300">{getDateDifference()}</span>
									</div>
								</div>
							</div>
							<div className="mt-5">
								<p className="text-theme-neutral-700">{comment}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
