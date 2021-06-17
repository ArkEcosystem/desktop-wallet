import { BlockfolioSignal } from "@arkecosystem/platform-sdk-news";
import { Card } from "app/components/Card";
import { Divider } from "app/components/Divider";
import { Label } from "app/components/Label";
import { Link } from "app/components/Link";
import { TimeAgo } from "app/components/TimeAgo";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { coins } from "domains/news/data";
import React from "react";
import { useTranslation } from "react-i18next";
import Linkify from "react-linkify";

type Properties = {
	coverImage?: string;
} & BlockfolioSignal;

export const NewsCard = ({ text, category, author, created_at: createdAt, coverImage }: Properties) => {
	const { t } = useTranslation();

	// @ts-ignore
	const asset: any = coins[author.coin?.toLowerCase()];

	return (
		<div data-testid="NewsCard">
			<Card className="bg-theme-background">
				<div className="flex flex-col p-4 space-y-8 bg-theme-background">
					<div className="flex justify-between w-full">
						<div className="flex items-center space-x-4">
							<NetworkIcon size="lg" coin={asset?.coin} network={asset?.network} noShadow />

							<div>
								<h4 className="text-lg font-semibold" data-testid={`NewsCard__asset-${asset?.name}`}>
									{asset?.name}
								</h4>
								<div className="flex items-center space-x-4">
									<p
										className="text-sm font-semibold text-theme-secondary-500 dark:text-theme-secondary-700"
										data-testid="NewsCard__author"
									>
										{author?.name}, {author?.title}
									</p>

									<Divider type="vertical" />

									<p
										className="text-sm font-semibold text-theme-secondary-500 dark:text-theme-secondary-700"
										data-testid="NewsCard__date-created"
									>
										<TimeAgo date={createdAt} />
									</p>
								</div>
							</div>
						</div>

						<div className="flex flex-col justify-end">
							<Label color="warning" variant="solid">
								<span className="text-sm" data-testid="NewsCard__category">
									#{t(`NEWS.CATEGORIES.${category.toUpperCase()}`)}
								</span>
							</Label>
						</div>
					</div>

					<Divider />

					<div className="whitespace-pre-line text-theme-secondary-text" data-testid="NewsCard__content">
						<Linkify
							componentDecorator={(pathname: string, text: string, key: number) => (
								<Link to={pathname} key={key} isExternal>
									{text}
								</Link>
							)}
						>
							{text}
						</Linkify>
					</div>

					{coverImage && (
						<div className="flex justify-center p-1 -mx-10 border-t-2 border-theme-primary-100 dark:border-theme-secondary-800">
							<img src={coverImage} alt="ARK Banner" />
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};
