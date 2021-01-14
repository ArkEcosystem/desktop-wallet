import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const Backdrop = ({ isVisible, className }: { isVisible: boolean; className: string }) => (
	<AnimatePresence>
		{isVisible && (
			<motion.div
				data-testid="Backdrop"
				className={`${className} fixed inset-0 bg-theme-secondary-900`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.5 }}
				exit={{ opacity: 0 }}
			/>
		)}
	</AnimatePresence>
);

const WalletTable = ({
	wallets,
	activeWalletId,
	onRowClick,
}: {
	wallets: ReadWriteWallet[];
	activeWalletId: string;
	onRowClick: any;
}) => {
	const { t } = useTranslation();

	const columns = [
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
		<Table columns={columns} data={wallets}>
			{(wallet: ReadWriteWallet) => (
				<WalletListItem wallet={wallet} activeWalletId={activeWalletId} onClick={onRowClick} />
			)}
		</Table>
	);
};

type WalletBottomSheetMenuProps = {
	wallets: ReadWriteWallet[];
	defaultIsOpen?: boolean;
};

export const WalletBottomSheetMenu = ({ wallets, defaultIsOpen }: WalletBottomSheetMenuProps) => {
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const history = useHistory();

	const { t } = useTranslation();

	useEffect(() => {
		document.body.style.overflow = "overlay";

		if (isOpen) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "overlay";
			return;
		};
	}, [isOpen]);

	const handleRowClick = (walletId: string) => {
		if (walletId !== activeWallet.id()) {
			history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}`);

			setIsOpen(false);
		}
	};

	const zIndexClass = useMemo(() => (isOpen ? "z-40" : "z-auto"), [isOpen]);

	return (
		<>
			<Backdrop isVisible={isOpen} className={zIndexClass} />

			<aside data-testid="WalletBottomSheetMenu" className={`${zIndexClass} sticky bottom-0 w-full`}>
				<div
					data-testid="WalletBottomSheetMenu__header"
					className="flex items-center bg-theme-secondary-900 dark:bg-theme-secondary-800"
				>
					<div className="container flex justify-between items-center py-7 px-14 mx-auto">
						<div>
							<span className="text-lg font-bold text-theme-secondary-400 dark:text-theme-secondary-200">
								{t("WALLETS.PAGE_WALLET_DETAILS.YOUR_WALLETS")}
							</span>
							<span
								data-testid="WalletBottomSheetMenu__counter"
								className="ml-1 font-bold text-theme-secondary-700"
							>
								{wallets.length}
							</span>
						</div>
						<div className="inline-flex items-center -mr-4 space-x-1">
							{isOpen && (
								<button
									data-testid="WalletBottomSheetMenu__filters"
									className="flex items-center py-1 px-5 font-medium border-r text-theme-secondary-400 dark:text-theme-secondary-200 border-theme-secondary-800 dark:border-theme-secondary-600 focus:outline-none"
								>
									<Icon name="Filters" width={16} height={20} />
								</button>
							)}
							<CollapseToggleButton
								data-testid="WalletBottomSheetMenu__toggle"
								isOpen={isOpen}
								className="text-theme-secondary-400 dark:text-theme-secondary-200"
								onClick={() => setIsOpen(!isOpen)}
							/>
						</div>
					</div>
				</div>

				<Collapse isOpen={isOpen} maxHeight="20rem" className="custom-scroll">
					<div className="py-8 bg-theme-background">
						<div data-testid="WalletTable" className="container px-14 mx-auto">
							<WalletTable
								wallets={wallets}
								activeWalletId={activeWallet.id()}
								onRowClick={handleRowClick}
							/>
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
