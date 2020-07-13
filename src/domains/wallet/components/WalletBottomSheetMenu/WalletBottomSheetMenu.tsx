import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import { WalletListItem, WalletListItemProps } from "app/components/WalletListItem";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Backdrop = ({ isVisible }: { isVisible: boolean }) => {
	return (
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
};

const WalletTable = ({ data }: { data: WalletListItemProps[] }) => {
	const columns = [
		{
			Header: "Asset Type",
			accessor: "avatarId",
		},
		{
			Header: "Wallet Address",
			accessor: "address",
		},
		{
			Header: "Wallet Type",
		},
		{
			Header: "Balance",
			accessor: "balance",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			accessor: "fiat",
			className: "float-right",
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

	return (
		<>
			<Backdrop isVisible={isOpen} />

			<aside data-testid="WalletBottomSheetMenu" className="absolute bottom-0 z-50 w-full">
				<div
					data-testid="WalletBottomSheetMenu__header"
					className="flex items-center h-20 px-6 theme-dark bg-theme-background"
				>
					<div className="container flex items-center justify-between mx-auto px-14">
						<div>
							<span className="text-lg font-bold text-theme-neutral-dark">Your wallets</span>
							<span
								data-testid="WalletBottomSheetMenu__counter"
								className="ml-1 font-bold text-theme-neutral-light"
							>
								{walletsData.length}
							</span>
						</div>
						<div className="inline-flex items-center space-x-1">
							{isOpen && (
								<button
									data-testid="WalletBottomSheetMenu__filters"
									className="flex items-center px-5 py-1 font-medium border-r text-theme-neutral border-theme-neutral-light focus:outline-none"
								>
									<Icon name="Filters" />
								</button>
							)}
							<CollapseToggleButton
								data-testid="WalletBottomSheetMenu__toggle"
								isOpen={isOpen}
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
