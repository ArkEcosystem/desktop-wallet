import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type Link = {
	link: string;
	type: string;
};

type LinkListProps = {
	description: string;
	links: Link[];
	title: string;
};

const linkIcons: Record<string, string> = {
	bitbucket: "BitBucket",
	facebook: "Facebook",
	flickr: "Flickr",
	github: "GitHub",
	gitlab: "GitLab",
	linkedin: "LinkedIn",
	npm: "Npm",
	twitter: "Twitter",
	vimeo: "Vimeo",
	youtube: "YouTube",
};

const LinkItem = ({ link }: { link: Link }) => {
	const { t } = useTranslation();

	return (
		<div className="flex items-center py-4 border-t border-dashed border-theme-neutral-300 first:border-0">
			<div className="flex justify-between flex-1">
				<div>
					<div className="text-sm font-semibold text-theme-neutral-500">
						{t(`TRANSACTION.LINK_TYPES.${link.type.toUpperCase()}`)}
					</div>

					<a href={link.link} className="inline-block mt-2 font-semibold link">
						{link.link}
					</a>
				</div>

				<Circle className="my-auto border-black bg-theme-background" size="lg">
					<Icon name={linkIcons[link.type]} width={20} height={20} />
				</Circle>
			</div>
		</div>
	);
};

export const LinkList = ({ description, links, title }: LinkListProps) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	const items = [];
	for (const link of links) {
		items.push(<LinkItem key={`${link.type}-${link.link}`} link={link} />);
	}

	return (
		<div data-testid="LinkList">
			<div
				data-testid="LinkList__header"
				className="flex justify-between cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div>
					<span className="text-lg font-semibold">{title}</span>
					<div className="mt-2 text-theme-neutral-700">{description}</div>
				</div>

				<div>
					{isExpanded && (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-theme-primary-600"
						/>
					)}
					{!isExpanded && (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 rounded-full bg-theme-primary-100 text-theme-primary-600"
						/>
					)}
				</div>
			</div>

			{isExpanded && <div>{items}</div>}
		</div>
	);
};
