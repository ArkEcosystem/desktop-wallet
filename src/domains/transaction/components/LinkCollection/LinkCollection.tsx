import { Button } from "app/components/Button";
import { FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputGroup } from "app/components/Input";
import { RadioButton } from "app/components/RadioButton";
import { Select } from "app/components/SelectDropdown";
import { Table } from "app/components/Table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { EntityLink } from "./LinkCollection.models";

type Type = {
	label: string;
	value: string;
};

type LinkCollectionProps = {
	data?: EntityLink[];
	description: string;
	selectionTypes?: string[];
	selectionTypeTitle?: string;
	title: string;
	typeName: string;
	types: Type[];
	onChange?: (links: EntityLink[]) => void;
};

const Wrapper = styled.div`
	table th {
		padding-bottom: 0;
	}
`;

// TODO: Validate url from provider
export const LinkCollection = ({
	data,
	title,
	description,
	types,
	typeName,
	selectionTypes,
	selectionTypeTitle,
	onChange,
}: LinkCollectionProps) => {
	const { t } = useTranslation();

	const [isExpanded, setIsExpanded] = useState(false);
	const [links, setLinks] = useState(data || []);
	const [selected, setSelected] = useState((null as unknown) as EntityLink);
	const [link, setLink] = useState("");
	const [selectedType, setSelectedType] = useState((null as unknown) as Type);

	const addLink = ({ type, value }: EntityLink) => {
		const result = [...links, { type, value }];
		setLinks(result);
		onChange?.(result);
	};

	const removeLink = ({ type, value }: EntityLink) => {
		const result = links.filter((thisLink) => thisLink.value !== value || thisLink.type !== type);
		setLinks(result);
		onChange?.(result);
	};

	const columns = [];
	if (selectionTypeTitle) {
		columns.push({
			Header: selectionTypeTitle,
			accessor: "isSelected",
		});
	}

	columns.push(
		{
			Header: t("COMMON.NAME"),
			accessor: "type",
		},
		{
			Header: t("COMMON.LINK"),
			accessor: "link",
		},
		{
			Header: " ",
		},
	);

	return (
		<Wrapper data-testid="LinkCollection" className="flex flex-col font-normal">
			<div
				data-testid="LinkCollection__header"
				className="flex items-center justify-between cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span className="text-lg font-semibold">{title}</span>

				<div>
					{isExpanded && (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-theme-primary"
						/>
					)}
					{!isExpanded && (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 rounded-full text-theme-primary bg-theme-primary-contrast"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 text-theme-neutral-dark">{description}</div>

			{isExpanded && (
				<div className="mt-4">
					<div>
						<div className="flex space-x-2">
							<div className="flex flex-col w-2/5">
								<div className="w-full">
									<FormLabel label={`Add ${typeName}`} />
								</div>
								<InputGroup className="flex flex-1">
									<Select options={types} onChange={(selected: any) => setSelectedType(selected)} />
								</InputGroup>
							</div>

							<div className="flex-1">
								<div className="mb-2">
									<FormLabel label={t("COMMON.LINK")} />
								</div>
								<InputGroup>
									<Input
										data-testid="LinkCollection__input-link"
										type="text"
										placeholder=" "
										className="pr-20"
										maxLength={255}
										onChange={(e) => setLink((e.target as HTMLInputElement).value)}
									/>
								</InputGroup>
							</div>
						</div>

						<Button
							disabled={!selectedType && !link}
							data-testid="LinkCollection__add-link"
							variant="plain"
							className="w-full mt-2"
							onClick={() => addLink({ value: link, type: selectedType?.value })}
						>
							{t("TRANSACTION.ADD_LINK")}
						</Button>
					</div>

					<div className="mt-8 mb-2 text-sm text-theme-neutral-dark">Your {typeName}</div>

					<Table columns={columns} data={links}>
						{(rowData: any, rowIndex: any) => (
							<tr className="font-semibold border-b border-theme-neutral-200">
								{selectionTypeTitle && (
									<td className="w-16 text-center">
										{selectionTypes && selectionTypes.includes(rowData.type) && (
											<RadioButton
												data-testid="LinkCollection__selected"
												checked={
													selected?.type === rowData.type && selected?.value === rowData.value
												}
												onChange={() => setSelected(rowData)}
											/>
										)}
									</td>
								)}

								<td className={`w-40 ${rowIndex > 0 ? "py-6" : "pb-6 pt-2"}`}>
									{t(`TRANSACTION.LINK_TYPES.${rowData.type.toUpperCase()}`)}
								</td>

								<td className={rowIndex > 0 ? "py-6" : "pb-6 pt-2"}>{rowData.value}</td>

								<td className={`w-16 text-right ${rowIndex === 0 && "pb-4"}`}>
									<Button
										data-testid="LinkCollection__remove-link"
										size="icon"
										variant="plain"
										onClick={() => removeLink({ value: rowData.value, type: rowData.type })}
									>
										<Icon name="Trash" />
									</Button>
								</td>
							</tr>
						)}
					</Table>
				</div>
			)}
		</Wrapper>
	);
};
