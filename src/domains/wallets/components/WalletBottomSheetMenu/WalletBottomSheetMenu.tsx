import { Collapse } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import { WalletListItem, WalletListItemProps } from "app/components/WalletListItem";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import tw, { styled } from "twin.macro";

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

const ToggleIcon = styled.span<{ isOpen: boolean }>`
	${tw`w-5 h-5 inline-flex items-center justify-center rounded-full transition-colors duration-200 transform`}
	${({ isOpen }) =>
		isOpen
			? tw`bg-theme-primary text-theme-primary-contrast rotate-180`
			: tw`text-theme-primary bg-theme-primary-contrast`}
`;

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

			<aside data-testid="WalletBottomSheetMenu" className="w-full z-50 bottom-0 absolute">
				<div data-testid="WalletBottomSheetMenu__header" className="theme-dark bg-theme-background py-4 px-6">
					<div className="max-w-4xl mx-auto flex items-center justify-between">
						<div>
							<span className="text-theme-neutral-dark text-lg font-bold">Your wallets</span>
							<span
								data-testid="WalletBottomSheetMenu__counter"
								className="text-theme-neutral-light font-bold ml-1"
							>
								{walletsData.length}
							</span>
						</div>
						<div className="inline-flex items-center space-x-1">
							{isOpen && (
								<button
									data-testid="WalletBottomSheetMenu__filters"
									className="text-theme-neutral font-medium py-1 px-5 border-r border-theme-neutral-light focus:outline-none flex items-center"
								>
									<Icon name="Filters" />
								</button>
							)}
							<button
								data-testid="WalletBottomSheetMenu__toggle"
								onClick={() => setIsOpen(!isOpen)}
								className="text-theme-neutral font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center space-x-2"
							>
								<span>{isOpen ? "Hide" : "Show All"}</span>
								<ToggleIcon isOpen={isOpen}>
									<Icon name="ChevronDown" />
								</ToggleIcon>
							</button>
						</div>
					</div>
				</div>

				<Collapse isOpen={isOpen} maxHeight="20rem">
					<div className="bg-theme-background px-6 py-8">
						<div className="max-w-4xl mx-auto">
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
