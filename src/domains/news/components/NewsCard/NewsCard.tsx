import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TimeAgo } from "app/components/TimeAgo";
import React from "react";
import { useTranslation } from "react-i18next";

type Asset = {
	icon: string;
	name: string;
	className?: string;
};

type Author = {
	name: string;
	role: string;
};

type Props = {
	asset: Asset;
	author: Author;
	dateCreated: string;
	category: string;
	content: string;
	coverImage?: string;
};

export const NewsCard = ({ asset, author, dateCreated, category, content, coverImage }: Props) => {
	const { t } = useTranslation();

	return (
		<Card className="bg-theme-background">
			<div className="flex flex-col p-4 space-y-8" data-testid="NewsCard">
				<div className="flex justify-between w-full">
					<div className="flex items-center space-x-4">
						<Circle className={asset?.className} size="lg" data-testid={`NewsCard__asset-${asset?.icon}`}>
							<Icon name={asset?.icon} width={20} height={20} />
						</Circle>

						<div>
							<h4 className="text-lg font-semibold" data-testid={`NewsCard__asset-${asset?.name}`}>
								{asset?.name}
							</h4>
							<div className="flex items-center space-x-4">
								<p className="text-sm font-semibold text-theme-neutral" data-testid="NewsCard__author">
									{author?.name}, {author?.role}
								</p>

								<Divider type="vertical" />

								<p
									className="text-sm font-semibold text-theme-neutral"
									data-testid="NewsCard__date-created"
								>
									<TimeAgo date={dateCreated} />
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
					{content}
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
