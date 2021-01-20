import { Card } from "app/components/Card";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tw, { css, styled } from "twin.macro";

type PluginCardProps = {
	isOwner: boolean;
	plugin: any;
	onClick?: () => void;
	onDisable?: () => void;
	onEnable?: () => void;
	onDelete?: () => void;
};

const PluginImageContainer = styled.div`
	${tw`mb-4 mr-4`}
	${css`
		& {
			width: 4.75rem;
			height: 4.75rem;
		}
	`}
`;

export const PluginCard = ({ isOwner, plugin, onClick, onEnable, onDisable, onDelete }: PluginCardProps) => {
	const { t } = useTranslation();

	const actions = useMemo(() => {
		const result = [{ label: t("COMMON.DELETE"), value: "delete" }];

		if (plugin.isEnabled) {
			result.push({ label: t("COMMON.DISABLE"), value: "disable" });
		} else {
			result.push({ label: t("COMMON.ENABLE"), value: "enable" });
		}

		return result;
	}, [t, plugin]);

	return (
		<div data-testid={`PluginCard--${plugin.id}`}>
			<Card
				onClick={onClick}
				actions={plugin.isInstalled ? actions : undefined}
				onSelect={(action: any) => {
					if (action.value === "delete") {
						onDelete?.();
					}
					if (action.value === "enable") {
						onEnable?.();
					}
					if (action.value === "disable") {
						onDisable?.();
					}
				}}
			>
				<div className="my-auto font-semibold">
					<PluginImageContainer>
						<img src={plugin.logo} alt="Logo" />
					</PluginImageContainer>

					<div className="flex items-center mb-2 space-x-2 text-lg text-theme-primary-600">
						<div>{plugin.name}</div>

						<div>
							{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
							{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
						</div>
					</div>

					<div className="flex space-x-4 text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
						<div className="pr-4 border-theme-secondary-300 dark:border-theme-secondary-800">
							{plugin.author}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

PluginCard.defaultProps = {
	isOwner: false,
};
