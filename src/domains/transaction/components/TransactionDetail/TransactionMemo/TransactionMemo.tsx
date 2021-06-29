import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

interface TransactionMemoProperties {
	memo: string;
}

export const TransactionMemo = ({ memo }: TransactionMemoProperties) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail
			label={t("TRANSACTION.MEMO")}
			extra={
				<div className="flex justify-center w-11 text-theme-secondary-900 dark:text-theme-secondary-600">
					<Icon name="Memo" width={18} height={22} />
				</div>
			}
		>
			<p className="break-all whitespace-pre-line">{memo}</p>
		</TransactionDetail>
	);
};
