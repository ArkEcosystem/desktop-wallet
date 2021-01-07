import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { RatingType, StarsCounters } from "./components/StarsCounters";

type Props = {
	ratings: RatingType[];
	totalAvaliations: number;
	averageScore: string;
	maximumScore?: string;
};

export const ReviewBox = ({ ratings, totalAvaliations, averageScore, maximumScore }: Props) => {
	const { t } = useTranslation();

	return (
		<div className="w-full">
			<div className="flex flex-col">
				<div className="flex items-center text-2xl whitespace-nowrap">
					<Icon className="mr-1 -mt-1" name="StarsOutline" width={34} height={19} />

					<span className="font-bold">
						{t("PLUGINS.REVIEW_BOX.AVERAGE_RATING")}: {averageScore}{" "}
						<span className="font-bold text-theme-neutral-light"> / {maximumScore}</span>
					</span>
				</div>
				<span className="pb-5 mt-1 text-sm font-bold text-theme-neutral-light">
					{t("PLUGINS.REVIEW_BOX.OUT_OF_X_REVIEWS", { count: totalAvaliations })}
				</span>
				<StarsCounters ratings={ratings} totalAvaliations={totalAvaliations} />
			</div>
		</div>
	);
};

ReviewBox.defaultProps = {
	maximumScore: 5,
};
