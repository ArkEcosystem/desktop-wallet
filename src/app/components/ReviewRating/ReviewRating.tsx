import { SvgCollection } from "app/assets/svg";
import React from "react";

interface ReviewRatingProperties {
	rating: number;
	width: number;
	showTotal: boolean;
}

export const ReviewRating = (properties: ReviewRatingProperties) => (
	<div className="flex items-center" data-testid="ReviewRating">
		<div className="relative">
			{properties.rating > 0 && (
				<div className="overflow-hidden absolute" style={{ width: `${((properties.rating - 1) / 4) * 100}%` }}>
					<SvgCollection.Star className={`text-theme-warning-400 w-${properties.width}`} />
				</div>
			)}

			<SvgCollection.Star
				className={`text-theme-secondary-500 dark:bg-theme-secondary-700 w-${properties.width}`}
			/>
		</div>

		<span className="ml-1">{properties.rating > 0 ? properties.rating : "-"}</span>

		{properties.showTotal && <span className="text-theme-secondary-500">/5</span>}
	</div>
);

ReviewRating.defaultProps = {
	showTotal: false,
	value: 0,
	width: 4,
};
