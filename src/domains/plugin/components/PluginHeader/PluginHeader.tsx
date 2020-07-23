import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import Placeholder from "domains/plugin/images/placeholder.png";
import React from "react";
import { useTranslation } from "react-i18next";

import { PluginSpecs } from "./components/PluginSpecs";

type Props = {
	author: string;
	category: string;
	url: string;
	rating: string;
	version: string;
	size: string;
	isInstalled?: boolean;
};

export const PluginHeader = ({ author, category, url, rating, version, size, isInstalled }: Props) => {
	const { t } = useTranslation();

	const getPluginButtons = () => {
		if (isInstalled) {
			return (
				<>
					<Button data-testid="PluginHeader__button--open">{t("COMMON.OPEN")}</Button>
					<Button className="ml-3" data-testid="PluginHeader__button--update">
						<Icon name="Update" />
					</Button>
					<Button className="ml-3" data-testid="PluginHeader__button--warning" variant="plain">
						<Icon name="Report" width={20} height={20} />
					</Button>
					<Button className="ml-3" data-testid="PluginHeader__button--uninstall" variant="plain">
						<Icon name="Trash" />
					</Button>
				</>
			);
		}

		return (
			<>
				<Button data-testid="PluginHeader__button--install">{t("COMMON.INSTALL")}</Button>
				<Button className="ml-3" data-testid="PluginHeader__button--warning" variant="plain">
					<Icon name="Report" width={20} height={20} />
				</Button>
			</>
		);
	};

	return (
		<div data-testid="plugin-details__header" className="w-full bg-theme-background">
			<div className="flex w-full">
				<img className="rounded-lg w-44 h-44" alt="Plugin" src={Placeholder} />
				<div className="flex flex-col justify-center w-full pl-8">
					<div className="flex items-center justify-between">
						<div className="flex flex-col">
							<span className="text-2xl font-bold">ARK Explorer</span>
							<span className="text-medium text-theme-neutral">
								Use the ARK Mainnet explorer directly within the wallet
							</span>
						</div>
						<div className="flex">{getPluginButtons()}</div>
					</div>
					<PluginSpecs
						author={author}
						category={category}
						url={url}
						rating={rating}
						version={version}
						size={size}
					/>
				</div>
			</div>
		</div>
	);
};

PluginHeader.defaultProps = {
	isInstalled: false,
};
