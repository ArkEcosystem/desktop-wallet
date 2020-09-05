import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";

import { EntityLink } from "../LinkCollection/LinkCollection.models";

type LinkType = { displayName: string } & EntityLink;

type LinkListProps = {
	description: string;
	links: LinkType[];
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

const LinkItem = ({ link }: { link: LinkType }) => (
	<div className="flex items-center py-4 border-t border-dashed border-theme-neutral-300 first:border-0">
		<div className="flex justify-between flex-1">
			<div>
				<div className="text-sm font-semibold text-theme-neutral">{link.displayName}</div>

				<Link to={link.value} className="inline-block mt-2 font-semibold link">
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
		<div data-testid="LinkList" className="flex flex-col">
			<div
				data-testid="LinkList__header"
				className="flex items-center justify-between cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span className="text-lg font-semibold">{title}</span>

				<div>
					{isExpanded && (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-theme-primary"
						/>
					)}
					{!isExpanded && (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 rounded-full bg-theme-primary-contrast text-theme-primary"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 text-theme-neutral-dark">{description}</div>

			{isExpanded && <div>{items}</div>}
		</div>
	);
};
