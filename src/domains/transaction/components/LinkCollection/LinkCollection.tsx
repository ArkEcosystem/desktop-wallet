import { Button } from "app/components/Button";
import { FormField, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { RadioButton } from "app/components/RadioButton";
import { Select } from "app/components/SelectDropdown";
import { Table, TableCell, TableRow } from "app/components/Table";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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

export const LinkCollection = ({
	data,
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
		mode: "onChange",
		defaultValues: {
			links: data,
		},
	});
	const { clearErrors, control, errors, formState, handleSubmit, register, setValue, trigger, watch } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "links",
		keyName: "value",
	});

	const { type, value } = watch();

	const [isExpanded, setIsExpanded] = useState(false);
	const [selected, setSelected] = useState((null as unknown) as EntityLink);

	const getType = (value: string) => types.find((item) => item.value === value);

	const validateProviderURL = (url: string) => getType(type)!.validate(url);

	const addLink = async (link: EntityLink) => {
		append(link);
		await Promise.resolve(setValue("value", "", { shouldValidate: true }));
		clearErrors("value");
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

	const handleSelectType = async (selectedItem: any) => {
		await Promise.resolve(setValue("type", selectedItem.value, { shouldValidate: true, shouldDirty: true }));

		if (value) {
			trigger("value");
		}
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
			className: "no-border",
		},
		{
			Header: "Actions",
			className: "hidden",
		},
	);

	return (
		<div data-testid="LinkCollection" className="flex flex-col font-normal">
			<div
				data-testid="LinkCollection__header"
				className="flex items-center justify-between cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span className="text-lg font-semibold">{title}</span>

				<div>
					{isExpanded ? (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-theme-primary"
						/>
					) : (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 rounded-full text-theme-primary bg-theme-primary-contrast"
						/>
					)}
				</div>
			</div>

			<div className="mt-2 text-theme-secondary-text">{description}</div>

			{isExpanded && (
				<div className="mt-4 space-y-4">
					<SubForm>
						<div
							className="grid gap-4"
							style={{
								gridTemplateColumns: "2fr 3fr",
							}}
						>
							<FormField name="type">
								<FormLabel label={`Add ${typeName}`} />
								<Select
									options={types}
									ref={register({ required: true })}
									onChange={handleSelectType}
								/>
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
									disabled={!type}
								/>
							</FormField>

							<Button
								data-testid="LinkCollection__add-link"
								className="col-span-2"
								variant="plain"
								type="button"
								disabled={!value || !formState.isValid} // @TODO disable on duplicate entry
								onClick={handleSubmit(({ type, value }) => addLink({ type, value }))}
							>
								{t("TRANSACTION.ADD_LINK")}
							</Button>
						</div>
					</SubForm>

					{fields && fields.length > 0 && (
						<Table columns={columns} data={fields} className="font-semibold">
							{(rowData: any, rowIndex: any) => (
								<TableRow>
									{selectionTypeTitle && (
										<TableCell
											variant="start"
											className="w-16"
											innerClassName="justify-center"
											isCompact
										>
											{selectionTypes && selectionTypes.includes(rowData.type) && (
												<RadioButton
													data-testid="LinkCollection__selected"
													checked={
														selected?.type === rowData.type &&
														selected?.value === rowData.value
													}
													onChange={() => setSelected(rowData)}
												/>
											)}
										</TableCell>
									)}

									<TableCell
										variant={selectionTypeTitle ? "middle" : "start"}
										className="w-40"
										innerClassName="font-semibold"
										isCompact
									>
										<input
											type="hidden"
											name={`links[${rowIndex}].type`}
											ref={register()}
											defaultValue={rowData.type}
										/>
										<span>{getType(rowData.type)!.label}</span>
									</TableCell>

									<TableCell innerClassName="font-semibold break-all" isCompact>
										<input
											type="hidden"
											name={`links[${rowIndex}].value`}
											ref={register()}
											defaultValue={rowData.value}
										/>
										<span>{rowData.value}</span>
									</TableCell>

									<TableCell variant="end" innerClassName="justify-end" isCompact>
										<Button
											data-testid="LinkCollection__remove-link"
											size="icon"
											variant="plain"
											onClick={() => removeLink(rowIndex)}
										>
											<Icon name="Trash" />
										</Button>
									</TableCell>
								</TableRow>
							)}
						</Table>
					)}
				</div>
			)}
		</div>
	);
};
