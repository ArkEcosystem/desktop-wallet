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

export const HistoryModal = ({ isOpen, handleClose, history }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.TYPE"),
		},
		{
			Header: t("COMMON.DATE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.TRANSACTION"),
			className: "justify-end",
		},
	];

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={t("PROFILE.MODAL_HISTORY.TITLE")} size="md">
			<div className="flex flex-col mt-5">
				<Table columns={columns} data={history} className="self-center">
					{(rowData: any) => (
						<tr
							data-testid="blockchain-table__row"
							className="border-b last:border-b-0 border-dashed border-theme-neutral-300"
						>
							<td className="py-6 font-semibold text-left">
								<span>{t(`PROFILE.MODAL_HISTORY.TYPES.${rowData.type}`)}</span>
							</td>
							<td className="py-6 font-semibold text-center">
								<span>{rowData.date}</span>
							</td>
							<td className="flex items-center justify-end py-6 font-semibold text-theme-primary-500">
								<Icon name="Redirect" width={15} height={15} />
								<span className="ml-2">View</span>
							</td>
						</tr>
					)}
				</Table>
				<div className="self-center mt-2">
					<Pagination
						totalCount={12}
						itemsPerPage={4}
						onSelectPage={console.log}
						currentPage={1}
						variant="condensed"
					/>
				</div>
			</div>
		</Modal>
	);
};

HistoryModal.defaultProps = {
	isOpen: false,
	repositories: [],
};
