import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";

import { RatingType, StarsCounters } from "./components/StarsCounters";

type Props = {
	ratings: RatingType[];
	totalAvaliations: number;
	averageScore: string;
	maximumScore?: string;
};

export const ReviewBox = ({ ratings, totalAvaliations, averageScore, maximumScore }: Props) => (
	<div className="w-full">
		<Button data-testid="ReviewBox__button--comment">Leave a comment</Button>
		<div className="flex flex-col mt-5">
			<div className="flex items-center">
				<div className="pr-3 text-theme-warning-300">
					<Icon name="Star" width={25} height={25} />
				</div>
				<div className="text-2xl">
					<span className="font-bold">{averageScore}</span>
					<span className="font-bold text-theme-neutral-400">/{maximumScore}</span>
				</div>
			</div>
			<span className="font-bold text-theme-neutral-400 text-sm border-b border-dashed border-theme-neutral mt-2 pb-5">
				Averaging rating for {totalAvaliations} reviews
			</span>
			<StarsCounters ratings={ratings} totalAvaliations={totalAvaliations} />
		</div>
	</div>
);

ReviewBox.defaultProps = {
	maximumScore: 5,
};
