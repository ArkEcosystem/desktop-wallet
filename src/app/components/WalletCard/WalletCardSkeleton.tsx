import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Skeleton } from "app/components/Skeleton";
import { useRandomNumber } from "app/hooks";
import React from "react";

export const WalletCardSkeleton = () => {
	const nameWidth = useRandomNumber(120, 150);
	const amountWidth = useRandomNumber(130, 170);
	const addressWidth = useRandomNumber(200, 220);

	return (
		<Card className="bg-theme-background">
			<div className="flex relative flex-col justify-between p-4 h-full" data-testid="WalletCard__skeleton">
				<div className="flex items-center">
					<div className="flex items-center mr-4 -space-x-1">
						<Circle className="border-transparent" size="lg">
							<Skeleton circle height={44} width={44} />
						</Circle>
						<Circle className="border-transparent" size="lg">
							<Skeleton circle height={44} width={44} />
						</Circle>
					</div>

					<Skeleton height={16} width={nameWidth} />
				</div>

				<div className="flex items-center mt-4 space-x-1 h-7">
					<Skeleton height={18} width={amountWidth} />
					<Skeleton height={18} width={35} />
				</div>

				<span className="flex items-center mt-1 h-4">
					<Skeleton height={12} width={addressWidth} />
				</span>
			</div>
		</Card>
	);
};
