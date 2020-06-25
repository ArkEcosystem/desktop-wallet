import { images } from "app/assets/images";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type BlacklistPluginsProps = {
	isOpen: boolean;
	onClose?: any;
};

const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const BlacklistPlugins = (props: BlacklistPluginsProps) => {
	const { t } = useTranslation();
	const data = [
		{
			name: "ARK Explorer",
			description: "ARK Ecosystem",
			category: "Utility",
			isOfficial: true,
		},
		{
			name: "Animal Avatars",
			description: "Breno Polanski",
			category: "Utility",
		},
		{
			name: "ChangeNOW Plugin",
			description: "ChangeNOW",
			category: "Other",
		},
		{
			name: "Bold Ninja",
			description: "Delegate Fun",
			category: "Game",
			isGrant: true,
		},
	];

	const columns = [
		{
			Header: " ",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
			className: "float-right",
		},
		{
			Header: "  ",
			disableSortBy: true,
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_BLACKLIST_PLUGINS.TITLE")}
			description={t("PLUGINS.MODAL_BLACKLIST_PLUGINS.DESCRIPTION")}
			size="4xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-dashed border-theme-neutral-200">
							<td className="w-16">
								<ChangeNowLogo className="w-12 h-12" />
							</td>

							<td>
								<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
									{rowData.name}
								</div>
								<div className="inline-flex items-center space-x-2">
									<span className="text-theme-neutral-700">{rowData.description}</span>
									{rowData.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
									{rowData.isGrant && <Icon name="Grant" width={16} height={16} />}
								</div>
							</td>

							<td className="py-10 text-right text-theme-neutral-700">{rowData.category}</td>
						</tr>
					)}
				</Table>
			</div>
		</Modal>
	);
};

BlacklistPlugins.defaultProps = {
	isOpen: false,
};
