import { images } from "app/assets/images";
import { Card } from "app/components/Card";
import { Icon } from "app/components/Icon";
import { ReviewRating } from "app/components/ReviewRating";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { css, styled } from "twin.macro";

type PluginCardProps = {
	isOwner: boolean;
	plugin: any;
	onClick: any;
	onDelete: any;
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

const ChangeNowLogo = images.exchange.components.AddExchange.ChangeNowLogo;

export const PluginCard = ({ isOwner, plugin, onClick, onDelete }: PluginCardProps) => {
	const { t } = useTranslation();

	const actions = [
		{ label: t("COMMON.VIEW"), value: "view" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	return (
		<Card
			className="border-theme-primary-contrast hover:border-theme-background"
			onClick={onClick}
			actions={plugin.isInstalled ? actions : undefined}
			onSelect={(action: any) => {
				if (action.value === "view") {
					onClick();
				}
				if (action.value === "delete") {
					onDelete();
				}
			}}
		>
			<div className="my-auto font-semibold">
				<PluginImageContainer>
					<ChangeNowLogo />
				</PluginImageContainer>

				<div className="flex items-center mb-2 text-lg space-x-2 text-theme-primary">
					<div>{plugin.name}</div>

					<div>
						{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
						{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
					</div>
				</div>

				<div className="flex text-sm text-theme-neutral-light space-x-4">
					<div className="pr-4 border-r border-theme-neutral-300">{plugin.author}</div>

					<div>
						<ReviewRating rating={plugin.rating} />
					</div>
				</div>
			</div>
		</Card>
	);
};

PluginCard.defaultProps = {
	isOwner: false,
};
