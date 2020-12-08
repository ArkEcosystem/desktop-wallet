import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Skeleton } from "app/components/Skeleton";
import { useRandomNumber } from "app/hooks";
import React from "react";

export const NewsCardSkeleton = () => {
	const titleWidth = useRandomNumber(100, 150);
	const authorWidth = useRandomNumber(80, 120);
	const positionWidth = useRandomNumber(80, 120);
	const lineWidth = useRandomNumber(30, 100);

	return (
		<Card className="bg-theme-background">
			<div className="flex flex-col p-4 space-y-8" data-testid="NewsCard__skeleton">
				<div className="flex justify-between w-full">
					<div className="flex items-center space-x-4">
						<div className="flex relative justify-center items-center h-12">
							<Skeleton circle width={44} height={44} />
							<Circle className="absolute border-transparent bg-theme-background" noShadow />
						</div>

						<div className="flex flex-col justify-between h-full">
							<Skeleton height={18} width={titleWidth} />

							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<Skeleton height={14} width={authorWidth} />
									<Skeleton height={14} width={positionWidth} />
								</div>

								<Divider type="vertical" />

								<Skeleton height={14} width={60} />
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-end">
						<Skeleton height={28} width={60} />
					</div>
				</div>

				<Divider />

				<div className="flex flex-col space-y-2">
					<Skeleton height={16} width="100%" />
					<Skeleton height={16} width="100%" />
					<Skeleton height={16} width={`${lineWidth}%`} />
				</div>
			</div>
		</Card>
	);
};
