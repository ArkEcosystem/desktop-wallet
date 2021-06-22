import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { isNil } from "@arkecosystem/utils";
import { Amount, AmountCrypto } from "app/components/Amount";
import { Label } from "app/components/Label";
import React from "react";

interface Properties {
	isSent: boolean;
	wallet: Contracts.IReadWriteWallet;
	total: number;
	convertedTotal?: number;
	exchangeCurrency?: string;
}

const BaseTransactionRowAmount: React.FC<Properties> = ({
	isSent,
	wallet,
	total,
	convertedTotal,
	exchangeCurrency,
}: Properties) => {
	const isNegative = total !== 0 && isSent;

	if (!!exchangeCurrency && !isNil(convertedTotal)) {
		return <Amount value={convertedTotal} ticker={exchangeCurrency} className="text-theme-secondary-text" />;
	}

	return (
		<Label color={isSent ? "danger" : "success"} className="whitespace-nowrap">
			<AmountCrypto withSign ticker={wallet.currency()} value={total} isNegative={isNegative} />
		</Label>
	);
};

const TransactionRowAmount = ({
	transaction,
	exchangeCurrency,
}: {
	transaction: DTO.ExtendedTransactionData;
	exchangeCurrency?: string;
}): JSX.Element => (
	<BaseTransactionRowAmount
		isSent={transaction.isSent()}
		wallet={transaction.wallet()}
		total={transaction.total()}
		convertedTotal={transaction.convertedTotal()}
		exchangeCurrency={exchangeCurrency}
	/>
);

export { BaseTransactionRowAmount, TransactionRowAmount };
