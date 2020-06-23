import { images } from "app/assets/images";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { ReviewRating } from "app/components/ReviewRating";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

type PluginCardProps = {
	isOwner: boolean;
	plugin: any;
	onClick: any;
	onDelete: any;
};

const PluginCardStyled = styled.div`
	${tw`relative pt-8 pb-12 px-10 flex flex-col border-2 rounded-lg cursor-pointer select-none hover:shadow-xl`}
`;

const ChangeNowLogo = images.exchange.components.AddExchange.ChangeNowLogo;

export const PluginCard = ({ isOwner, plugin, onClick, onDelete }: PluginCardProps) => {
	const { t } = useTranslation();
	const options = [
		{ label: "View", value: "view" },
		{ label: "Delete", value: "delete" },
	];

	return (
		<PluginCardStyled
			data-testid={`PluginCard--${plugin.id}`}
			className="border-theme-primary-100 hover:border-theme-background"
			onClick={onClick}
		>
			<div className="my-auto font-semibold">
				{plugin.isInstalled && (
					<div className="absolute top-4 right-2 text-theme-primary-200">
						<Dropdown
							toggleIcon="Settings"
							options={options}
							onSelect={(option: any) => {
								if (option.value === "delete") {
									onDelete();
								}
							}}
						/>
					</div>
				)}

				<div className="mb-4 mr-4">
					<ChangeNowLogo className="w-12 h-12" />
				</div>

				<div className="flex items-center mb-2 text-lg space-x-2 text-theme-primary-600">
					<div>{plugin.name}</div>

					<div>
						{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
						{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
					</div>
				</div>

				<div className="flex text-sm text-theme-neutral-400 space-x-4">
					<div className="pr-4 border-r border-theme-neutral-300">{plugin.author}</div>

					<div>
						<ReviewRating rating={plugin.rating} />
					</div>
				</div>
			</div>
		</PluginCardStyled>
	);
};

PluginCard.defaultProps = {
	isOwner: false,
};
