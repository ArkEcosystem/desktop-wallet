import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import React from "react";
import Skeleton from "react-loading-skeleton";

export const NewsCardSkeleton = () => (
	<Card className="bg-theme-background">
		<div className="flex flex-col p-4 space-y-8" data-testid="NewsCard__skeleton">
			<div className="flex justify-between w-full">
				<div className="flex items-center space-x-4">
					<Circle aria-label="network" className="border-theme-neutral-300 dark:border-theme-neutral-800" />

					<div>
						<div>
							<Skeleton height={6} width={100} style={{ verticalAlign: "middle" }} />
						</div>
						<div className="flex items-center space-x-4 align-middle">
							<p className="text-theme-neutral" data-testid="NewsCard__author">
								<Skeleton height={6} width={100} style={{ verticalAlign: "middle" }} />
								<Skeleton height={6} width={100} style={{ verticalAlign: "middle" }} className="ml-2" />
							</p>

							<Divider type="vertical" />

							<Skeleton height={6} width={60} style={{ verticalAlign: "middle" }} />
							<p
								className="text-sm font-semibold text-theme-neutral"
								data-testid="NewsCard__date-created"
							>
								<Skeleton height={6} width="80%" />
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-end">
					<Skeleton height={6} width={60} style={{ verticalAlign: "middle" }} />
				</div>
			</div>

			<Divider />

			<p className="text-theme-secondary-text" data-testid="NewsCard__content">
				<Skeleton height={6} width="100%" style={{ verticalAlign: "middle" }} />
				<Skeleton height={6} width="100%" style={{ verticalAlign: "middle" }} />
				<Skeleton height={6} width="100%" style={{ verticalAlign: "middle" }} />
			</p>
		</div>
	</Card>
);
