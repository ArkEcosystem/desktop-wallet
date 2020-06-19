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
				<div className="absolute overflow-hidden" style={{ width: `${((props.rating - 1) / 4) * 100}%` }}>
					<SvgCollection.Star className={`text-theme-warning-300 w-${props.width}`} />
				</div>
			)}

			<SvgCollection.Star className={`text-theme-neutral-500 w-${props.width}`} />
		</div>

		<span className="leading-tight my-auto ml-1 {{ $ratingClass ?? '' }}">
			{props.rating > 0 ? props.rating : "-"}
		</span>

		{props.showTotal && <span className="text-theme-neutral-500">/5</span>}
	</div>
);

ReviewRating.defaultProps = {
	value: 0,
	width: 5,
	showTotal: false,
};
