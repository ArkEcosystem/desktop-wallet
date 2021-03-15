import { Checkbox } from "app/components/Checkbox";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Category = {
	label: string;
	value: string | number;
};

type FilterProps = {
	categories?: Category[];
	initialValues?: any;
	onChange?: any;
	onReset?: any;
};

const CategoryCheckboxes = ({ categories, selected, onChange }: any) => {
	const isSelected = (categoryValue: any, list: string[]) => list?.some((item) => item === categoryValue);

	const updateCategories = (isChecked: boolean, categoryValue: any) => {
		const values = selected.concat();

		if (isChecked) {
			values.push(categoryValue);
		} else {
			const index = selected.findIndex((item: string) => item === categoryValue);
			values.splice(index, 1);
		}

		onChange?.(values);
	};

	return (
		<fieldset>
			{categories &&
				categories.map((category: Category, index: number) => (
					<label
						className="block flex items-center px-2 pb-1 mb-1 space-x-2 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-secondary-100"
						key={index}
					>
						<span>
							<Checkbox
								checked={isSelected(category.value, selected)}
								onChange={(ev: any) => updateCategories(ev.target.checked, category.value)}
								name="category"
								data-testid={`SearchBarPluginFilters-category-${category.value}`}
							/>
						</span>
						<span className="mt-1">{category.label}</span>
					</label>
				))}
		</fieldset>
	);
};

export const SearchBarPluginFilters = ({ categories, initialValues, onReset, onChange }: FilterProps) => {
	const { t } = useTranslation();

	const defaultCategories = [
		{
			label: t("PLUGINS.FILTERS.CATEGORIES.GAME"),
			value: "game",
		},
		{
			label: t("PLUGINS.FILTERS.CATEGORIES.UTILITY"),
			value: "utility",
		},
		{
			label: t("PLUGINS.FILTERS.CATEGORIES.EXCHANGE"),
			value: "exchange",
		},
		{
			label: t("PLUGINS.FILTERS.CATEGORIES.OTHER"),
			value: "other",
		},
	];

	const categoryOptions = categories || defaultCategories;

	const [selectedCategories, setSelectedCategories] = useState(initialValues.categories);

	const onResetFilters = () => {
		setSelectedCategories([]);
		onReset?.();
	};

	const onChangeCategory = (selected: any) => {
		setSelectedCategories(selected);
		onChange?.({
			categories: selected,
		});
	};

	return (
		<div data-testid="SearchBarPluginFilters" className="flex relative z-20 items-center text-theme-primary-400">
			<Dropdown
				position="right"
				toggleContent={
					<div className="mr-8 cursor-pointer">
						<Icon name="Filters" width={20} height={20} />
					</div>
				}
			>
				<div className="py-4 px-6 w-64">
					<div className="mb-1 font-semibold text-theme-secondary-text">{t("COMMON.CATEGORY")}</div>
					<CategoryCheckboxes
						categories={categoryOptions}
						selected={selectedCategories}
						onChange={onChangeCategory}
					/>

					<div className="my-4 border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800" />

					<div
						data-testid="SearchBarPluginFilters-reset"
						onClick={onResetFilters}
						className="flex items-center pl-2 cursor-pointer text-theme-primary-500 hover:text-theme-primary-600 hover:underline"
					>
						<Icon name="Reset" />
						<span className="pl-2">{t("COMMON.RESET_FILTERS")}</span>
					</div>
				</div>
			</Dropdown>
		</div>
	);
};

SearchBarPluginFilters.defaultProps = {
	initialValues: {
		categories: [],
	},
};
