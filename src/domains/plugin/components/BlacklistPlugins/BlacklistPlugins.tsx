import { images } from "app/assets/images";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { Table, TableCell, TableRow } from "app/components/Table";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type BlacklistPluginsProps = {
	isOpen: boolean;
	plugins: any;
	onClose?: any;
	blacklisted?: any;
};

const { BestPluginsBanner } = images.plugin.common;
const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const BlacklistPlugins = ({ isOpen, plugins, onClose, blacklisted }: BlacklistPluginsProps) => {
	const [blacklistedPlugins, setBlacklistedPlugins] = useState<any>([]);
	const activeProfile = useActiveProfile();
	const { t } = useTranslation();

	useEffect(() => {
		setBlacklistedPlugins(blacklisted.map((id: any) => plugins.find((plugin: any) => id === plugin.id)));
	}, [plugins, blacklisted]);

	console.log({ plugins });
	console.log({ blacklistedPlugins });

	const columns = [
		{
			Header: "Logo",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
			className: "justify-end",
		},
		{
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_BLACKLIST_PLUGINS.TITLE")}
			titleClass="text-white"
			description={t("PLUGINS.MODAL_BLACKLIST_PLUGINS.DESCRIPTION")}
			banner={<BestPluginsBanner className="h-full" />}
			size="4xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={blacklistedPlugins}>
					{(rowData: any) => (
						<TableRow>
							<TableCell variant="start" className="w-16">
								<ChangeNowLogo className="w-12 h-12" />
							</TableCell>

							<TableCell>
								<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
									{rowData.name}
								</div>
								<div className="inline-flex items-center space-x-2">
									<span className="text-theme-neutral-dark">{rowData.author}</span>
									{rowData.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
									{rowData.isGrant && <Icon name="Grant" width={16} height={16} />}
								</div>
							</TableCell>

							<TableCell variant="end" innerClassName="justify-end text-theme-neutral-dark">
								{t(`PLUGINS.CATEGORIES.${rowData.category?.toUpperCase()}`)}
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</Modal>
	);
};

BlacklistPlugins.defaultProps = {
	isOpen: false,
	plugins: [],
};
