import { Button } from "app/components/Button";
import { FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputGroup } from "app/components/Input";
import { RadioButton } from "app/components/RadioButton";
import { Select } from "app/components/SelectDropdown";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

type Link = {
	link: string;
	type: string;
};

type Type = {
	label: string;
	value: string;
};

type LinkCollectionProps = {
	data?: Link[];
	description: string;
	selectionTypes?: string[];
	selectionTypeTitle?: string;
	title: string;
	typeName: string;
	types: Type[];
};

const Wrapper = styled.div`
	table th {
		padding-bottom: 0;
	}
`;

export const LinkCollection = ({
	data,
	title,
	description,
	types,
	typeName,
	selectionTypes,
	selectionTypeTitle,
}: LinkCollectionProps) => {
	const { t } = useTranslation();

	const [isExpanded, setIsExpanded] = React.useState(false);
	const [links, setLinks] = React.useState(data || []);
	const [selected, setSelected] = React.useState((null as unknown) as Link);
	const [link, setLink] = React.useState("");
	const [selectedType, setSelectedType] = React.useState((null as unknown) as Type);

	const addLink = ({ link, type }: Link) => {
		setLinks([...links, { link, type }]);
	};

	const removeLink = ({ link, type }: Link) => {
		setLinks(links.filter((thisLink) => thisLink.link !== link || thisLink.type !== type));
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
			Header: "Name",
			accessor: "type",
		},
		{
			Header: "Link",
			accessor: "link",
		},
		{
			Header: " ",
		},
	);

	return (
		<Wrapper data-testid="LinkCollection" className="font-normal">
			<div
				data-testid="LinkCollection__header"
				className="flex justify-between cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div>
					<span className="font-semibold">{title}</span>
					<div className="mt-2 text-theme-neutral-700">{description}</div>
				</div>

				<div>
					{isExpanded && (
						<Icon
							name="ChevronUp"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-theme-primary-600"
						/>
					)}
					{!isExpanded && (
						<Icon
							name="ChevronDown"
							width={10}
							height={10}
							className="flex items-center justify-center w-5 h-5 rounded-full text-theme-primary-600 bg-theme-primary-100"
						/>
					)}
				</div>
			</div>

			{isExpanded && (
				<div className="mt-4">
					<div>
						<div className="flex space-x-2">
							<div className="flex flex-col w-1/4">
								<div className="w-full">
									<FormLabel label={`Add ${typeName}`} />
								</div>
								<InputGroup className="flex flex-1">
									<Select options={types} onChange={(selected: any) => setSelectedType(selected)} />
								</InputGroup>
							</div>

							<div className="flex-1">
								<div className="mb-2">
									<FormLabel label="Link" />
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
							onClick={() => addLink({ link, type: selectedType?.value })}
						>
							Add Link
						</Button>
					</div>

					<div className="mt-8 mb-2 text-sm text-theme-neutral-700">Your {typeName}</div>

					<Table columns={columns} data={links}>
						{(rowData: any, rowIndex: any) => (
							<tr className="font-semibold border-b border-theme-neutral-200">
								{selectionTypeTitle && (
									<td className="w-16 text-center">
										{selectionTypes && selectionTypes.includes(rowData.type) && (
											<RadioButton
												data-testid="LinkCollection__selected"
												checked={
													selected?.type === rowData.type && selected?.link === rowData.link
												}
												onChange={() => setSelected(rowData)}
											/>
										)}
									</td>
								)}

								<td className={`w-40 ${rowIndex > 0 ? "py-6" : "pb-6 pt-2"}`}>
									{t(`TRANSACTION.LINK_TYPES.${rowData.type.toUpperCase()}`)}
								</td>

								<td className={rowIndex > 0 ? "py-6" : "pb-6 pt-2"}>{rowData.link}</td>

								<td className={`w-16 text-right ${rowIndex === 0 && "pb-4"}`}>
									<Button
										data-testid="LinkCollection__remove-link"
										size="icon"
										variant="plain"
										onClick={() => removeLink({ link: rowData.link, type: rowData.type })}
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
