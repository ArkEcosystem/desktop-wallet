import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
	repository: string;
	url: string;
};

export const RepositoryLink = ({ repository, url }: Props) => (
	<div className="flex items-center space-x-5">
		<Circle className="border-theme-neutral-800" size="large">
			<Icon name={repository} width={22} height={22} />
		</Circle>
		<div className="flex flex-col space-y-1">
			<span className="text-sm text-theme-neutral-400">{repository}</span>
			<Link className="text-theme-primary" to={{ pathname: url }} target="_blank">
				{url}
			</Link>
		</div>
	</div>
);
