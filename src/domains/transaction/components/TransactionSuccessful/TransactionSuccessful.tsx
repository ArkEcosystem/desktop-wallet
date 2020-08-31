import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";

type TransactionSuccessfulProps = {
	children?: React.ReactNode;
	transaction?: Contracts.SignedTransactionData;
	senderWallet?: ReadWriteWallet;
};

const { TransactionSuccessfulBanner } = images.transaction.common;

export const TransactionSuccessful = ({ children, transaction, senderWallet }: TransactionSuccessfulProps) => {
	const coinName = senderWallet?.manifest().get<string>("name");
	const network = `${coinName} ${senderWallet?.network().name()}`;

	return (
		<section data-testid="TransactionSuccessful" className="space-y-8">
			<div>
				<h1 className="mb-0">Transaction Sent</h1>
				<div className="grid grid-flow-row gap-2">
					<div className="w-full my-10">
						<TransactionSuccessfulBanner className="w-full" />
					</div>
					<p className="mb-4 text-theme-neutral-dark">
						Your transaction was successfully sent. Please monitor the blockchain to ensure your transaction
						is confirmed and processed. The following is relevant information for your transaction:
					</p>
					<TransactionDetail label="ID" border={false}>
						<div className="flex items-center">
							<Address addressClass="text-theme-primary" address={transaction?.id()} maxChars={32} />
							<span className="ml-5">
								<Clipboard data={transaction?.id()}>
									<div className="text-theme-primary-300">
										<Icon name="Copy" />
									</div>
								</Clipboard>
							</span>
						</div>
					</TransactionDetail>

					<TransactionDetail
						label="Network"
						extra={
							<div className="ml-1 text-theme-danger">
								<Circle className="bg-theme-background border-theme-danger-light" size="lg">
									{coinName && (
										<Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />
									)}
								</Circle>
							</div>
						}
					>
						{network}
					</TransactionDetail>

					<TransactionDetail extra={<Avatar size="lg" address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
						<div className="mb-2 text-sm font-semibold text-theme-neutral">
							<span className="mr-1">Sender</span>
							<Label color="warning">
								<span className="text-sm">Your address</span>
							</Label>
						</div>
						<Address address={transaction?.sender()} walletName={senderWallet?.alias()} />
					</TransactionDetail>

					{children}
				</div>
			</div>
		</section>
	);
};
