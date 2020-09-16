import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
import React from "react";

export default {
	title: "App / Components / Table",
};

export const Default = () => {
	const data = [
		{
			coin: "ARK",
			avatarId: "test",
			walletName: "My wallet",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			balance: "2,000 ARK",
			fiat: "43,086.08 USD",
		},
		{
			coin: "Btc",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			balance: "100 BTC",
			fiat: "1000000 USD",
		},
	];

	const columns = [
		{
			Header: "Asset Type",
			accessor: "avatarId",
		},
		{
			Header: "Wallet Address",
			accessor: "address",
		},
		{
			Header: "Balance",
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: "Fiat Value",
			accessor: "fiat",
			className: "justify-end",
		},
	];

	return (
		<div>
			<div>
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<TableRow>
							<TableCell variant="start">
								<Circle>
									<Icon name={rowData.coin} />
								</Circle>
								<Avatar address={rowData.address} />
							</TableCell>

							<TableCell>
								<Address walletName={rowData.walletName} address={rowData.address} />
							</TableCell>

							<TableCell className="justify-end font-semibold">
								<span>{rowData.balance}</span>
							</TableCell>

							<TableCell variant="end" className="justify-end font-semibold text-theme-neutral-light">
								<span>{rowData.fiat}</span>
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</div>
	);
};
