import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import React from "react";
import { useTranslation } from "react-i18next";

import { PluginSpecs } from "./components/PluginSpecs";

type Props = {
	title: string;
	description?: string;
	logo?: string;
	author?: string;
	category: string;
	homepage?: string;
	version: string;
	size: string;
	isInstalled?: boolean;
	isOfficial?: boolean;
};

export const PluginHeader = (props: Props) => {
	const { t } = useTranslation();

	const getPluginButtons = () => {
		if (props.isInstalled) {
			return (
				<>
					<Button data-testid="PluginHeader__button--open">{t("COMMON.OPEN")}</Button>
					{/* <Button className="ml-3" data-testid="PluginHeader__button--update">
						<Icon name="Update" />
					</Button> */}
					<Button className="ml-3" data-testid="PluginHeader__button--warning" variant="secondary">
						<Icon name="Report" width={20} height={20} />
					</Button>
					<Button className="ml-3" data-testid="PluginHeader__button--uninstall" variant="secondary">
						<Icon name="Trash" />
					</Button>
				</>
			);
		}

		return (
			<>
				<Button data-testid="PluginHeader__button--install">{t("COMMON.INSTALL")}</Button>
				<Button className="ml-3" data-testid="PluginHeader__button--warning" variant="secondary">
					<Icon name="Report" width={20} height={20} />
				</Button>
			</>
		);
	};

	return (
		<div data-testid="plugin-details__header" className="w-full bg-theme-background">
			<div className="flex w-full">
				<div className="rounded-lg overflow-hidden w-40 h-full">
					{props.logo ? (
						<img data-testid="PluginCard__logo" src={props.logo} alt="Logo" className="rounded-lg w-full" />
					) : (
						<Image name="PluginLogoPlaceholder" domain="plugin" />
					)}
				</div>
				<div className="flex flex-col justify-between space-y-3 pl-8 w-full">
					<div className="flex justify-between items-center">
						<div className="flex flex-col mr-2">
							<span className="text-2xl font-bold">{props.title}</span>
							<span className="text-medium text-theme-secondary-500">{props.description}</span>
						</div>
						<div className="flex">{getPluginButtons()}</div>
					</div>
					<Divider dashed />
					<PluginSpecs {...props} />
				</div>
			</div>
		</div>
	);
};

PluginHeader.defaultProps = {
	name: "ARK Explorer",
	isInstalled: false,
};
