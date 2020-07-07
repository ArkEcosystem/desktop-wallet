import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";

export default {
	title: "App / Components / Table",
};

export const Default = () => {
	const data = [
		{
			coin: "Ark",
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
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			accessor: "fiat",
			className: "float-right",
		},
	];

	return (
		<div>
			<div>
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-theme-neutral-200">
							<td className="py-4 mt-1">
								<div className="flex">
									<Circle>
										<Icon name={rowData.coin} />
									</Circle>
									<Avatar address={rowData.address} />
								</div>
							</td>
							<td className="py-1">
								<Address walletName={rowData.walletName} address={rowData.address} />
							</td>
							<td className="py-1 text-right text-bold">
								<div>{rowData.balance}</div>
							</td>
							<td className="py-1 text-right text-bold text-theme-neutral-400">
								<div>{rowData.fiat}</div>
							</td>
						</tr>
					)}
				</Table>
			</div>
		</div>
	);
};
