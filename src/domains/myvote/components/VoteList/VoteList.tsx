import { Address } from "app/components/Address";
import { TransactionDetail } from "app/components/TransactionDetail";
import { Avatar } from "domains/wallet/components/Avatar";
import React from "react";

type VoteListProps = {
	votes?: any[];
};

export const VoteList = ({ votes }: VoteListProps) => {
	return (
		<div>
			{votes?.map((vote: any, index: number) => (
				<TransactionDetail
					key={index}
					border={index !== 0}
					label=" "
					extra={
						<div>
							<Avatar address={vote.address} />
						</div>
					}
				>
					<Address address={vote.address} walletName={vote.delegateName} size="large" />
				</TransactionDetail>
			))}
		</div>
	);
};

VoteList.defaultProps = {
	votes: [],
};
