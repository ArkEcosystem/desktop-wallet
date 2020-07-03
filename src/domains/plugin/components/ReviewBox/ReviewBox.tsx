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
		<div className="flex flex-col">
			<div className="flex items-center text-2xl whitespace-no-wrap">
				<Icon className="mr-1 -mt-1" name="StarsOutline" width={34} height={19} />

				<span className="font-bold">
					Avg. Rating: {averageScore}{" "}
					<span className="font-bold text-theme-neutral-400"> / {maximumScore}</span>
				</span>
			</div>
			<span className="pb-5 mt-1 text-sm font-bold text-theme-neutral-400">
				Out of {totalAvaliations} reviews
			</span>
			<StarsCounters ratings={ratings} totalAvaliations={totalAvaliations} />
		</div>
	</div>
);

ReviewBox.defaultProps = {
	maximumScore: 5,
};
