import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";

type SocialButtonProps = {
	icon: string;
	link?: string;
};

export const SocialButton = ({ icon, link }: SocialButtonProps) => (
	<Link
		to={link}
		className="block w-16 border rounded-lg cursor-pointer border-theme-neutral-300 dark:border-theme-neutral-800 h-14 lg:w-14 lg:h-12 transition-default hover:bg-theme-danger-400 hover:text-white"
		showExternalIcon={false}
		isExternal
	>
		<div className="flex items-center justify-center h-full">
			<Icon name={icon} width={20} height={20} />
		</div>
	</Link>
);
