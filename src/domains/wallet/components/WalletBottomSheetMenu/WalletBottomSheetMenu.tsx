import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import { WalletListItem, WalletListItemProps } from "app/components/WalletListItem";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";

const Backdrop = ({ isVisible }: { isVisible: boolean }) => (
	<AnimatePresence>
		{isVisible && (
			<motion.div
				data-testid="Backdrop"
				className="fixed inset-0 z-10 bg-theme-neutral-900"
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.5 }}
				exit={{ opacity: 0 }}
			/>
		)}
	</AnimatePresence>
);

const WalletTable = ({ data }: { data: WalletListItemProps[] }) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.ASSET_TYPE"),
			accessor: "avatarId",
		},
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: "fiat",
			className: "justify-end",
		},
	];

	return (
		<Table columns={columns} data={data}>
			{(rowData: any) => <WalletListItem {...rowData} />}
		</Table>
	);
};

type Props = {
	walletsData: WalletListItemProps[];
	defaultIsOpen?: boolean;
};

export const WalletBottomSheetMenu = ({ walletsData, defaultIsOpen }: Props) => {
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	const { t } = useTranslation();

	return (
		<>
			<Backdrop isVisible={isOpen} />

			<aside data-testid="WalletBottomSheetMenu" className="sticky bottom-0 z-50 w-full">
				<div data-testid="WalletBottomSheetMenu__header" className="flex items-center bg-theme-neutral-900">
					<div className="container flex items-center justify-between mx-auto px-14 py-7">
						<div>
							<span className="text-lg font-bold text-theme-neutral-light">
								{t("WALLETS.PAGE_WALLET_DETAILS.YOUR_WALLETS")}
							</span>
							<span
								data-testid="WalletBottomSheetMenu__counter"
								className="ml-1 font-bold text-theme-neutral-dark"
							>
								{walletsData.length}
							</span>
						</div>
						<div className="inline-flex items-center space-x-1">
							{isOpen && (
								<button
									data-testid="WalletBottomSheetMenu__filters"
									className="flex items-center px-5 py-1 font-medium border-r text-theme-neutral-dark border-theme-neutral-800 focus:outline-none"
								>
									<Icon name="Filters" width={16} height={20} />
								</button>
							)}
							<CollapseToggleButton
								data-testid="WalletBottomSheetMenu__toggle"
								isOpen={isOpen}
								className="text-theme-neutral-dark"
								onClick={() => setIsOpen(!isOpen)}
							/>
						</div>
					</div>
				</div>

				<Collapse isOpen={isOpen} maxHeight="20rem">
					<div className="py-8 bg-theme-background">
						<div className="container mx-auto px-14">
							<WalletTable data={walletsData} />
						</div>
					</div>
				</Collapse>
			</aside>
		</>
	);
};

WalletBottomSheetMenu.defaultProps = {
	defaultIsOpen: false,
};
