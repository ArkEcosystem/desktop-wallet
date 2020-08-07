import { BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { Card } from "app/components/Card";
import { Divider } from "app/components/Divider";
import { Label } from "app/components/Label";
import { TimeAgo } from "app/components/TimeAgo";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { coins } from "domains/news/data";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	coin: any;
	coverImage?: string;
} & BlockfolioSignal;

export const NewsCard = ({ text, category, author, created_at: createdAt, coin, coverImage }: Props) => {
	const { t } = useTranslation();

	const asset: any = coins[coin];

	return (
		<Card className="bg-theme-background">
			<div className="flex flex-col p-4 space-y-8" data-testid="NewsCard">
				<div className="flex justify-between w-full">
					<div className="flex items-center space-x-4">
						<NetworkIcon coin={asset?.coin} network={asset?.network} noShadow />

						<div>
							<h4 className="text-lg font-semibold" data-testid={`NewsCard__asset-${asset?.name}`}>
								{asset?.name}
							</h4>
							<div className="flex items-center space-x-4">
								<p className="text-sm font-semibold text-theme-neutral" data-testid="NewsCard__author">
									{author?.name}, {author?.title}
								</p>

								<Divider type="vertical" />

								<p
									className="text-sm font-semibold text-theme-neutral"
									data-testid="NewsCard__date-created"
								>
									<TimeAgo date={createdAt} />
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-end">
						<Label color="warning">
							<span className="text-sm" data-testid="NewsCard__category">
								#{t(`NEWS.CATEGORIES.${category.toUpperCase()}`)}
							</span>
						</Label>
					</div>
				</div>

				<Divider />

				<p className="text-theme-neutral-dark" data-testid="NewsCard__content">
					{text}
				</p>

				{coverImage && (
					<div className="flex justify-center p-1 -mx-10 border-t-2 border-theme-primary-contrast">
						<img src={coverImage} alt="ARK Banner" />
					</div>
				)}
			</div>
		</Card>
	);
};
