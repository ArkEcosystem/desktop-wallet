import { SvgCollection } from "app/assets/svg";
import React from "react";

type ReviewRatingProps = {
	rating: number;
	width: number;
	showTotal: boolean;
};

export const ReviewRating = (props: ReviewRatingProps) => (
	<div className="flex items-center" data-testid="ReviewRating">
		<div className="relative">
			{props.rating > 0 && (
				<div className="overflow-hidden absolute" style={{ width: `${((props.rating - 1) / 4) * 100}%` }}>
					<SvgCollection.Star className={`text-theme-warning-400 w-${props.width}`} />
				</div>
			)}

			<SvgCollection.Star className={`text-theme-secondary-500 dark:bg-theme-secondary-700 w-${props.width}`} />
		</div>

		<span className="ml-1">{props.rating > 0 ? props.rating : "-"}</span>

		{props.showTotal && <span className="text-theme-secondary-500">/5</span>}
	</div>
);

ReviewRating.defaultProps = {
	value: 0,
	width: 4,
	showTotal: false,
};
