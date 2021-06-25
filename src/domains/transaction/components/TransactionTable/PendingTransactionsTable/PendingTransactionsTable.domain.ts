import { TFunction } from "i18next";

const createTableColumns = (t: TFunction): {
	accessor?: string;
	cellWidth?: string;
	className?: string;
	Header: string;
	minimumWidth?: boolean;
	sortDescFirst?: boolean;
}[] => [
	{
		Header: t("COMMON.ID"),
		minimumWidth: true,
	},
	{
		Header: t("COMMON.DATE"),
		accessor: "timestamp",
		sortDescFirst: true,
		cellWidth: "w-50",
	},
	{
		Header: t("COMMON.RECIPIENT"),
		cellWidth: "w-96",
	},
	{
		Header: t("COMMON.INFO"),
		className: "justify-center",
	},
	{
		Header: t("COMMON.STATUS"),
		className: "justify-center",
		minimumWidth: true,
	},
	{
		Header: t("COMMON.AMOUNT"),
		accessor: "amount",
		className: "justify-end no-border",
	},
	{
		Header: "Sign",
		className: "hidden",
		cellWidth: "w-24",
	},
];

export { createTableColumns };
