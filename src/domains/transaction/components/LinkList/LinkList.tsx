import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

export type ProviderEntityLink = { displayName: string } & EntityLink;

type LinkListProps = {
	description: string;
	links: ProviderEntityLink[];
	title: string;
};

const linkIcons: Record<string, string> = {
	bitbucket: "BitBucket",
	github: "GitHub",
	gitlab: "GitLab",
	npm: "Npm",

	discord: "Discord",
	facebook: "Facebook",
	instagram: "Instagram",
	linkedin: "LinkedIn",
	medium: "Medium",
	reddit: "Reddit",
	telegram: "Send",
	slack: "Slack",
	twitter: "Twitter",
	youtube: "YouTube",

	imgur: "Imgur",
	flickr: "Flickr",
	vimeo: "Vimeo",
};

const LinkItem = ({ link }: { link: ProviderEntityLink }) => (
	<div className="flex items-center py-4 border-t border-dashed border-theme-neutral-300 dark:border-theme-neutral-800 first:border-0">
		<div className="flex flex-1 justify-between">
			<div>
				<div className="text-sm font-semibold text-theme-neutral-500">{link.displayName}</div>

				<Link to={link.value} className="inline-block mt-1 font-semibold link">
					{link.value}
				</Link>
			</div>

			<Circle className="my-auto border-black bg-theme-background" size="lg">
				<Icon name={linkIcons[link.type]} width={20} height={20} />
			</Circle>
		</div>
	</div>
);

export const LinkList = ({ description, links, title }: LinkListProps) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	const items = [];
	for (const link of links) {
		items.push(<LinkItem key={`${link.type}-${link.value}`} link={link} />);
	}

	return (
		<div data-testid="LinkList" className="flex flex-col font-normal">
			<div
				data-testid="LinkList__header"
				className="flex justify-between items-center cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span className="text-lg font-semibold">{title}</span>

				<div>
					{isExpanded ? (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex justify-center items-center w-5 h-5 text-white rounded-full bg-theme-primary-600"
						/>
					) : (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex justify-center items-center w-5 h-5 rounded-full text-theme-primary-600 bg-theme-primary-100"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 text-theme-secondary-text">{description}</div>

			{isExpanded && <div>{items}</div>}
		</div>
	);
};
