import { Icon } from "app/components/Icon";
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
	<div className="space-y-6">
		{ratings.map(({ rating, votes }: RatingType, index: number) => {
			const calculatedRating = (votes / totalAvaliations) * 100;

			const stars = [...Array(rating)].map((e, index) => <Icon key={index} name="Star" width={13} height={13} />);

			return (
				<div className="flex flex-col" key={index}>
					<div className="flex justify-between" data-testid={`${rating}-stars__rating-row`}>
						<div className="flex items-center space-x-1 text-theme-warning-400">{stars}</div>
						<span className="font-bold">{votes}</span>
					</div>
					<div className="mt-1 w-full h-2 rounded-lg bg-theme-secondary-200">
						<RatingCount
							className="h-2 rounded-lg bg-theme-warning-400"
							width={calculatedRating}
							data-testid={`${rating}-stars__rating-count`}
						/>
					</div>
				</div>
			);
		})}
	</div>
);
