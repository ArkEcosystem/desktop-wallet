import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	isOpen?: boolean;
	handleClose?: any;
	history?: any;
};

const columns = [
	{
		Header: "Type",
		className: "font-semibold",
	},
	{
		Header: "Date",
		className: "font-semibold justify-center",
	},
	{
		Header: "Transaction",
		className: "font-semibold float-right",
	},
];

export const HistoryModal = ({ isOpen, handleClose, history }: Props) => {
	const { t } = useTranslation();

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={t("PROFILE.MODAL_HISTORY.TITLE")} size="md">
			<div className="flex flex-col mt-5">
				<Table columns={columns} data={history} className="self-center">
					{(rowData: any) => (
						<tr
							data-testid="blockchain-table__row"
							className="border-b border-dashed border-theme-neutral-300"
						>
							<td className="py-6 font-semibold text-left">
								<span>{t(`PROFILE.MODAL_HISTORY.TYPES.${rowData.type}`)}</span>
							</td>
							<td className="py-6 font-semibold text-center">
								<span>{rowData.date}</span>
							</td>
							<td className="flex items-center float-right py-6 font-semibold text-theme-primary-500">
								<Icon name="Redirect" width={22} height={22} />
								<span className="ml-1">View</span>
							</td>
						</tr>
					)}
				</Table>
				<div className="self-center mt-2">
					<Pagination totalCount={12} itemsPerPage={4} onSelectPage={console.log} currentPage={1} size="sm" />
				</div>
			</div>
		</Modal>
	);
};

HistoryModal.defaultProps = {
	isOpen: false,
	repositories: [],
};
