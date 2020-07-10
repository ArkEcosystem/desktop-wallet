import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type RepositoryLinkProps = {
	provider: string;
	url: string;
};

export const RepositoryLink = ({ provider, url }: RepositoryLinkProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex items-center space-x-5">
			<Circle className="border-theme-neutral-800" size="lg">
				<Icon name={provider} width={22} height={22} data-testid="repository-link__icon" />
			</Circle>
			<div className="flex flex-col space-y-1">
				<span className="text-sm text-theme-neutral-light">{t(`PROFILE.MODAL_REPOSITORIES.${provider}`)}</span>
				<Link className="text-theme-primary" to={{ pathname: url }} target="_blank">
					{url}
				</Link>
			</div>
		</div>
	);
};
