import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";

type VoteListProps = {
	votes?: ReadOnlyWallet[];
};

export const VoteList = ({ votes }: VoteListProps) => (
	<div className="-my-5">
		{votes?.map((vote: ReadOnlyWallet, index: number) => (
			<TransactionDetail key={index} border={index !== 0}>
				<div className="space-x-2">
					<Avatar size="sm" address={vote.address()} />
					<Address address={vote.address()} walletName={vote.username()} />
				</div>
			</TransactionDetail>
		))}
	</div>
);

VoteList.defaultProps = {
	votes: [],
};
