import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionMemoProps = {
	memo: string;
};

export const TransactionMemo = ({ memo }: TransactionMemoProps) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail
			label={t("TRANSACTION.SMARTBRIDGE")}
			extra={
				<div className="flex justify-center w-11 text-theme-secondary-900 dark:text-theme-secondary-600">
					<Icon name="Smartbridge" width={18} height={22} />
				</div>
			}
		>
			<p className="break-all">{memo}</p>
		</TransactionDetail>
	);
};
