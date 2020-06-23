import React from "react";
import styled from "styled-components";

export type RatingCountProps = {
	width: number;
};

const RatingCount = styled.div(({ width }: RatingCountProps) => ({
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
					<div className="w-full h-2 mt-1 rounded-lg bg-theme-neutral-200">
						<RatingCount
							className="h-2 rounded-lg bg-theme-warning-300"
							width={calculatedRating}
							data-testid={`${rating}-stars__rating-count`}
						/>
					</div>
				</div>
			);
		})}
	</div>
);
