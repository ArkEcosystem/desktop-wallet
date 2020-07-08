import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";

const { TransactionSuccessfulBanner } = images.transaction.common;

export const TransactionSuccessful = ({ children }: { children: React.ReactNode }) => (
	<section data-testid="TransactionSuccessful" className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Successful</h1>
			<div className="grid grid-flow-row gap-2">
				<div className="w-full my-10">
					<TransactionSuccessfulBanner className="w-full" />
				</div>
				<p className="mb-4 text-theme-neutral-dark">
					Your transaction was successfully sent. Please monitor the blockchain to ensure your transaction is
					confirmed and processed. The following is relevant information for your transaction:
				</p>
				<TransactionDetail label="ID" border={false}>
					<div className="flex items-center">
						<Clipboard>
							<Address
								addressClass="text-theme-primary"
								address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
								maxChars={32}
							/>
						</Clipboard>
						<div className="mb-1 ml-5 text-theme-primary-300">
							<Icon name="Copy" />
						</div>
					</div>
				</TransactionDetail>

				<TransactionDetail label="Block ID">
					<div className="flex items-center">
						<Clipboard>
							<Address
								addressClass="text-theme-primary"
								address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWKAUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
								maxChars={32}
							/>
						</Clipboard>
						<div className="mb-1 ml-5 text-theme-primary-300">
							<Icon name="Copy" />
						</div>
					</div>
				</TransactionDetail>

				<TransactionDetail
					label="Network"
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					extra={
						<div className="mt-2">
							<Avatar address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
						</div>
					}
				>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">Sender</span>
						<Label color="warning">
							<span className="text-sm">Your address</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				{children}
			</div>
		</div>
	</section>
);
