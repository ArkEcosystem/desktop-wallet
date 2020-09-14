import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type EntityTableRowItemProps = {
	entity: ExtendedTransactionData;
	type?: string;
	onAction?: any;
};

export const EntityTableRowItem = ({ onAction, entity, type }: EntityTableRowItemProps) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");

	const { t } = useTranslation();

	const options = [
		{ label: t("COMMON.UPDATE"), value: "update" },
		{ label: t("COMMON.RESIGN"), value: "resign" },
	];

	const { data }: any = entity.asset();

	return (
		<TableRow
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
		>
			<TableCell variant="start" className="w-24">
				<div className="flex items-center">
					<Circle className="border-theme-neutral-800" size="lg" shadowColor={shadowColor}>
						<Icon name="Business" width={22} height={22} />
					</Circle>
					<Avatar address={entity.sender()} size="lg" className="mr-4" shadowColor={shadowColor} />
				</div>
			</TableCell>

			<TableCell>
				<Address walletName={entity.wallet().alias()} address={entity.wallet().address()} maxChars={12} />
			</TableCell>

			<TableCell innerClassName="font-semibold">
				<span>{data?.name}</span>
			</TableCell>

			<TableCell innerClassName="font-semibold justify-center text-theme-primary">
				<span>{t("COMMON.VIEW")}</span>
			</TableCell>

			<TableCell innerClassName="justify-center text-theme-neutral-light">
				<Icon name="Redirect" className="text-center" />
			</TableCell>

			<TableCell innerClassName="font-semibold justify-center text-theme-primary">
				<Icon name="Msq" width={22} height={22} />
			</TableCell>

			<TableCell innerClassName="font-semibold justify-center text-theme-primary">
				<span>{t("COMMON.VIEW")}</span>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<Button variant="plain" size="sm" className="ml-16">
					<Dropdown
						toggleIcon="Settings"
						options={options}
						onSelect={({ value }: any) =>
							onAction?.({
								walletId: entity.wallet().id(),
								txId: entity.id(),
								entity,
								type,
								action: value,
							})
						}
					/>
				</Button>
			</TableCell>
		</TableRow>
	);
};
