import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";
import { PluginSpecs } from "./components/PluginSpecs";

type Props = {
	title?: string;
	description?: string;
	logo?: string;
	author?: string;
	category: string;
	url?: string;
	version?: string;
	size?: string;
	isInstalled?: boolean;
	isOfficial?: boolean;
	isEnabled?: boolean;
	hasUpdateAvailable?: boolean;
	onReport?: () => void;
	onInstall?: () => void;
	hasLaunch?: boolean;
	onLaunch?: () => void;
	onDelete?: () => void;
	onEnable?: () => void;
	onDisable?: () => void;
	onUpdate?: () => void;
	updatingStats?: any;
};

export const PluginHeader = ({
	onDelete,
	onLaunch,
	onInstall,
	onReport,
	onEnable,
	onDisable,
	onUpdate,
	updatingStats,
	...props
}: Props) => {
	const { t } = useTranslation();

	const actions = useMemo(() => {
		const result: DropdownOption[] = [];

		if (props.hasUpdateAvailable) {
			result.push({ label: t("COMMON.UPDATE"), value: "update" });
		}

		if (props.isEnabled) {
			result.push({ label: t("COMMON.DISABLE"), value: "disable" });
		} else {
			result.push({ label: t("COMMON.ENABLE"), value: "enable" });
		}

		result.push({ label: t("COMMON.DELETE"), value: "delete" });

		return result;
	}, [t, props]);

	const getPluginButtons = () => {
		if (props.isInstalled) {
			return (
				<div className="flex items-center space-x-3">
					{props.hasLaunch && (
						<Button data-testid="PluginHeader__button--launch" onClick={onLaunch}>
							{t("COMMON.LAUNCH")}
						</Button>
					)}
					<Button data-testid="PluginHeader__button--report" variant="secondary" onClick={onReport}>
						<Icon name="Report" width={20} height={20} />
					</Button>

					<Dropdown
						toggleContent={
							<Button
								data-testid="PluginHeader__dropdown-toggle"
								variant="secondary"
								size="icon"
								className="text-left"
							>
								<Icon name="Settings" width={20} height={20} />
							</Button>
						}
						options={actions}
						onSelect={(option: any) => {
							if (option.value === "delete") {
								onDelete?.();
							}

							if (option.value === "enable") {
								return onEnable?.();
							}

							if (option.value === "disable") {
								return onDisable?.();
							}

							if (option.value === "update") {
								return onUpdate?.();
							}
						}}
						dropdownClass="text-left"
					/>
				</div>
			);
		}

		return (
			<>
				<Button data-testid="PluginHeader__button--install" onClick={onInstall}>
					{t("COMMON.INSTALL")}
				</Button>
				<Button
					className="ml-3"
					onClick={onReport}
					data-testid="PluginHeader__button--report"
					variant="secondary"
				>
					<Icon name="Report" width={20} height={20} />
				</Button>
			</>
		);
	};

	return (
		<div data-testid="plugin-details__header" className="w-full bg-theme-background">
			<div className="flex w-full">
				<PluginImage
					size="lg"
					logoURL={props.logo}
					isEnabled={props.isEnabled}
					isUpdating={updatingStats?.percent !== undefined}
					updatingProgress={updatingStats?.percent}
					showUpdatingLabel
				/>

				<div className="flex flex-col justify-between pl-8 w-full">
					<div className="flex justify-between items-end">
						<div className="flex flex-col space-y-2 mr-2 leading-tight">
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
