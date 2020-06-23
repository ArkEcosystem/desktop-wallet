import { Icon } from "app/components/Icon";
import React from "react";

type Comment = {
	author: string;
	score: string;
	comment: string;
	date: string;
};

type Props = {
	comments: Comment[];
};
export const Comments = ({ comments }: Props) => (
	<div className="w-full">
		<p className="font-bold text-xl">Reviews ARK Explorer</p>
		<div className="mt-5">
			{comments.map(({ author, score, date, comment }, idx) => (
				<div className="flex flex-col text-sm" key={idx}>
					<div className="w-1/4">
						<div className="grid grid-cols-3 divide-x divide-theme-neutral-300">
							<div>
								<span className="font-bold text-sm">{author}</span>
							</div>
							<div className="flex items-center justify-center text-theme-warning-300">
								<Icon name="Star" width={10} height={10} />
								<span className="ml-3 flex text-theme-neutral-500">{score}</span>
							</div>
							<div className="px-3">
								<span className="text-theme-neutral-300">3 days ago</span>
							</div>
						</div>
					</div>
					<div className="mt-5 w-1/2">
						<p className="text-theme-neutral-700">{comment}</p>
					</div>
				</div>
			))}
		</div>
	</div>
);
