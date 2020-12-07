import { SvgCollection } from "app/assets/svg";
import React from "react";

type ReviewRatingProps = {
	rating: number;
	width: number;
	showTotal: boolean;
};

export const ReviewRating = (props: ReviewRatingProps) => (
	<div className="flex" data-testid="ReviewRating">
		<div className="relative my-auto">
			{props.rating > 0 && (
				<div className="overflow-hidden absolute" style={{ width: `${((props.rating - 1) / 4) * 100}%` }}>
					<SvgCollection.Star className={`text-theme-warning-400 w-${props.width}`} />
				</div>
			)}

			<SvgCollection.Star className={`text-theme-neutral w-${props.width}`} />
		</div>

		<span className="leading-tight my-auto ml-1 {{ $ratingClass ?? '' }}">
			{props.rating > 0 ? props.rating : "-"}
		</span>

		{props.showTotal && <span className="text-theme-neutral">/5</span>}
	</div>
);

ReviewRating.defaultProps = {
	value: 0,
	width: 5,
	showTotal: false,
};
