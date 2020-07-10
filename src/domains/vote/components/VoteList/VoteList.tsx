import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";

type VoteListProps = {
	votes?: any[];
};

export const VoteList = ({ votes }: VoteListProps) => {
	return (
		<div className="-my-5">
			{votes?.map((vote: any, index: number) => (
				<TransactionDetail key={index} border={index !== 0} extra={<Avatar size="lg" address={vote.address} />}>
					<Address address={vote.address} walletName={vote.delegateName} />
				</TransactionDetail>
			))}
		</div>
	);
};

VoteList.defaultProps = {
	votes: [],
};
