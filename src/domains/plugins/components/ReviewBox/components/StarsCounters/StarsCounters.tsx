import React from "react";
import styled from "styled-components";

const RatingCount = styled.div(({ width }) => ({
	width: `${width}%`,
}));

export type RatingType = {
	rating: number;
	votes: number;
};

export type Props = {
	ratings: RatingType[];
	totalAvaliations: number;
};

export const StarsCounters = ({ ratings, totalAvaliations }: Props) => (
	<div>
		{ratings.map(({ rating, votes }, idx) => {
			const calculatedRating = (votes / totalAvaliations) * 100;

			return (
				<div className="flex flex-col mt-7" key={idx}>
					<div className="flex justify-between" data-testid={`${rating}-stars__rating-row`}>
						<span className="font-bold">{rating} stars</span>
						<div className="font-bold">
							<span>{votes}</span>
							<span className="text-theme-neutral-400">/{totalAvaliations}</span>
						</div>
					</div>
					<div className="bg-theme-neutral-200 w-full h-2 rounded-lg mt-1">
						<RatingCount
							className="bg-theme-warning-300 h-2 rounded-lg"
							width={calculatedRating}
							data-testid={`${rating}-stars__rating-count`}
						/>
					</div>
				</div>
			);
		})}
	</div>
);
