import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { RadioButton } from "app/components/RadioButton";
import { Select } from "app/components/SelectDropdown";
import { Table } from "app/components/Table";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { EntityLink } from "./LinkCollection.models";

type Type = {
	label: string;
	value: string;
	validate: (value: string) => boolean;
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
	onChoose?: (link: EntityLink) => void;
};

const Wrapper = styled.div`
	table th {
		padding-bottom: 0;
	}
`;

export const LinkCollection = ({
	data = [],
	title,
	description,
	types,
	typeName,
	selectionTypes,
	selectionTypeTitle,
	onChange,
	onChoose,
}: LinkCollectionProps) => {
	const { t } = useTranslation();
	const form = useForm<{ type: string; value: string; links: EntityLink[] }>({
		defaultValues: {
			links: data,
		},
	});
	const { control, register, setValue, getValues, handleSubmit, errors, clearError } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "links",
		keyName: "value",
	});

	useEffect(() => {
		if (data.length !== fields.length) append(data);
	}, [fields, data, append]);

	const [isExpanded, setIsExpanded] = useState(false);
	const [selected, setSelected] = useState((null as unknown) as EntityLink);

	const getType = (value: string) => types.find((item) => item.value === value);

	const validateProviderURL = (url: string) => {
		const currentTypeValue = getValues("type");
		return getType(currentTypeValue)!.validate(url);
	};

	const addLink = (link: EntityLink) => {
		append(link);
		setValue("value", "");
		clearError("value");
	};

	const removeLink = (index: number) => {
		remove(index);
	};

	useEffect(() => {
		onChange?.(fields as EntityLink[]);
	}, [fields, onChange]);

	useEffect(() => {
		onChoose?.(selected);
	}, [selected, onChoose]);

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
					<div
						className="grid row-gap-4 col-gap-2"
						style={{
							gridTemplateColumns: "40% 60%",
						}}
					>
						<FormField name="type">
							<FormLabel label={`Add ${typeName}`} />
							<Select options={types} ref={register({ required: true })} />
						</FormField>

						<FormField name="value">
							<FormLabel label={t("COMMON.LINK")} />
							<Input
								data-testid="LinkCollection__input-link"
								ref={register({
									required: true,
									validate: {
										validateProviderURL,
									},
								})}
								isInvalid={!!errors?.value}
							/>
						</FormField>

						<Button
							data-testid="LinkCollection__add-link"
							className="col-span-2"
							variant="plain"
							type="button"
							onClick={handleSubmit(({ type, value }) => addLink({ type, value }))}
						>
							{t("TRANSACTION.ADD_LINK")}
						</Button>
					</div>

					<div className="mt-8 mb-2 text-sm text-theme-neutral-dark">Your {typeName}</div>

					<Table columns={columns} data={fields}>
						{(rowData: any, rowIndex: any) => (
							<tr key={rowData.value} className="font-semibold border-b border-theme-neutral-200">
								{selectionTypeTitle && (
									<td
										className={`w-16 text-center align-middle ${
											rowIndex > 0 ? "py-6" : "pb-6 pt-2"
										}`}
									>
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

								<td className={`w-40 ${rowIndex > 0 ? "py-6" : "pb-6 pt-2 align-middle"}`}>
									<input
										type="hidden"
										name={`links[${rowIndex}].type`}
										ref={register()}
										defaultValue={rowData.type}
									/>
									{getType(rowData.type)!.label}
								</td>

								<td className={`break-all align-middle ${rowIndex > 0 ? "py-6" : "pb-6 pt-2"}`}>
									<input
										type="hidden"
										name={`links[${rowIndex}].value`}
										ref={register()}
										defaultValue={rowData.value}
									/>
									{rowData.value}
								</td>

								<td className={`w-16 text-right align-middle ${rowIndex === 0 && "pb-4"}`}>
									<Button
										data-testid="LinkCollection__remove-link"
										size="icon"
										variant="plain"
										onClick={() => removeLink(rowIndex)}
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
