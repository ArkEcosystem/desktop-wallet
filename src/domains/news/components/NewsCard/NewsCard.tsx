import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import React from "react";

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

export const NewsCard = ({ asset, author, dateCreated, category, content, coverImage }: Props) => (
	<Card>
		<div className="flex flex-col p-4 space-y-8">
			<div className="flex justify-between w-full">
				<div className="flex items-center space-x-4">
					<Circle className={asset?.className} size="lg">
						<Icon name={asset?.icon} width={20} height={20} />
					</Circle>

					<div>
						<p className="text-lg font-semibold">{asset?.name}</p>
						<div className="flex items-center space-x-4">
							<p className="text-sm font-semibold text-theme-neutral">
								{author?.name}, {author?.role}
							</p>
							<Divider type="vertical" />
							<p className="text-sm font-semibold text-theme-neutral">{dateCreated}</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-end">
					<Label color="warning">
						<span className="text-sm">#{category}</span>
					</Label>
				</div>
			</div>

			<Divider />

			<p className="text-theme-neutral-dark">{content}</p>

			{coverImage && (
				<div className="flex justify-center p-1 -mx-10 border-t-2 border-theme-primary-contrast">
					<img src={coverImage} alt="ARK Banner" />
				</div>
			)}
		</div>
	</Card>
);
