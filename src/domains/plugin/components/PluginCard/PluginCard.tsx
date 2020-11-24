import { Avatar } from "app/components/Avatar";
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

export const PluginCard = ({ isOwner, plugin, onClick, onDelete }: PluginCardProps) => {
	const { t } = useTranslation();

	const actions = [
		{ label: t("COMMON.VIEW"), value: "view" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	return (
		<div data-testid={`PluginCard--${plugin.id}`}>
			<Card
				className="h-full border-theme-primary-contrast hover:border-theme-background"
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
				<div className="h-full flex flex-col justify-between my-auto font-semibold">
					<PluginImageContainer>
						{plugin.logo ? (
							<img src={plugin.logo} alt={plugin.name} />
						) : (
							<Avatar address={`${plugin.id}`} rounded={false} size="xl" className="rounded" noShadow />
						)}
					</PluginImageContainer>

					<div className="flex-1 flex items-center mb-2 space-x-2 text-lg text-theme-primary">
						<div>{plugin.name}</div>

						<div>
							{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
							{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
						</div>
					</div>

					<div className="flex space-x-4 divide-x-1 divide-theme-neutral-300 dark:divide-theme-neutral-800 text-sm text-theme-neutral-light">
						<div>{plugin.author}</div>

						{plugin.rating && (
							<div>
								<ReviewRating rating={plugin.rating} />
							</div>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

PluginCard.defaultProps = {
	isOwner: false,
};
