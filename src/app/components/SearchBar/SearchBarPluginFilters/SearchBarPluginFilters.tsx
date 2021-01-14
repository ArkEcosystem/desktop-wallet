import { Checkbox } from "app/components/Checkbox";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useState } from "react";

type Category = {
	label: string;
	value: string | number;
};
type FilterProps = {
	categoriesLabel?: string;
	categories: Category[];
	ratingsLabel?: string;
	ratingsSuffix?: string;
	claimedLabel?: string;
	resetFiltersLabel?: string;
	ratings?: number[];
	initialValues?: any;
	onChange?: any;
	onReset?: any;
};

const Stars = ({ length = 5, value }: any) => {
	const stars = Array.from({ length });
	return (
		<span className="flex text-theme-neutral-400">
			{stars.map((_, index: number) => (
				<span key={index} className={`${index < value ? "text-theme-warning-300" : ""} mr-1`}>
					<Icon name={`${index < value ? "Star" : "StarOutline"}`} width={20} height={20} />
				</span>
			))}
		</span>
	);
};

const RatingsCheckboxes = ({ ratings, suffixLabel, value, onChange }: any) => (
	<fieldset>
		{ratings &&
			ratings.map((rating: number) => (
				<label
					className="block flex items-center px-2 pb-1 space-x-2 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-neutral-100"
					key={rating}
				>
					<span>
						<Checkbox
							name="test"
							type="radio"
							checked={value === rating}
							onChange={() => onChange(rating)}
							className="mt-px rounded-lg"
							data-testid={`SearchBarPluginFilters-rating-${rating}`}
						/>
					</span>
					<span className="flex items-center mt-1 space-x-1">
						<Stars value={rating} />
						<span>{suffixLabel}</span>
					</span>
				</label>
			))}
	</fieldset>
);

const CategoryCheckboxes = ({ categories, selected, onChange }: any) => {
	const isSelected = (categoryValue: any, list: string[]) => list?.some((item) => item === categoryValue);

	const updateCategories = (isChecked: boolean, categoryValue: any) => {
		const values = selected.concat();

		if (isChecked) values.push(categoryValue);
		else {
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
						className="block flex items-center px-2 pb-1 mb-1 space-x-2 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-neutral-100"
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

export const SearchBarPluginFilters = ({
	categories,
	ratings,
	ratingsLabel,
	ratingsSuffix,
	categoriesLabel,
	initialValues,
	onReset,
	onChange,
}: FilterProps) => {
	const [rating, setRating] = useState(initialValues.rating);
	const [claimed, setClaimed] = useState(initialValues.claimed);
	const [selectedCategories, setSelectedCategories] = useState(initialValues.categories);

	const onResetFilters = () => {
		setClaimed(false);
		setRating(null);
		setSelectedCategories([]);
		onReset?.();
	};

	const onChangeRating = (value: number) => {
		setRating(value);
		onChange?.({
			rating: value,
			categories: selectedCategories,
			claimed,
		});
	};

	const onChangeCategory = (selected: any) => {
		setSelectedCategories(selected);
		onChange?.({
			categories: selected,
			rating,
			claimed,
		});
	};

	const onChangeClaimed = (value: boolean) => {
		setClaimed(value);
		onChange?.({
			claimed: value,
			categories: selectedCategories,
			rating,
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
					<label className="block flex items-center px-2 pb-1 space-x-3 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-neutral-100">
						<span>
							<Checkbox
								name="claim"
								className="rounded-lg"
								checked={claimed}
								onChange={(ev: any) => onChangeClaimed(ev.target.checked)}
								data-testid={`SearchBarPluginFilters-claimed`}
							/>
						</span>
						<span className="mt-1 ml-1">Claimed</span>
					</label>

					<div className="mt-3 mb-4 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800" />
					<div className="mb-1 font-semibold text-theme-secondary-text">{categoriesLabel}</div>
					<CategoryCheckboxes
						categories={categories}
						selected={selectedCategories}
						onChange={onChangeCategory}
					/>

					<div className="my-4 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800" />

					<div className="font-semibold text-theme-secondary-text">{ratingsLabel}</div>
					<RatingsCheckboxes
						ratings={ratings}
						suffixLabel={ratingsSuffix}
						value={rating}
						onChange={onChangeRating}
					/>

					<div className="my-4 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800" />
					<div
						data-testid="SearchBarPluginFilters-reset"
						onClick={onResetFilters}
						className="flex items-center pl-2 cursor-pointer text-theme-primary-500 hover:text-theme-primary-600 hover:underline"
					>
						<Icon name="Reset" />
						<span className="pl-2">Reset Filters</span>
					</div>
				</div>
			</Dropdown>
		</div>
	);
};

SearchBarPluginFilters.defaultProps = {
	ratingsLabel: "Rating",
	categoriesLabel: "Category",
	categories: [
		{
			label: "Game",
			value: "game",
		},
		{
			label: "Utility",
			value: "utility",
		},
		{
			label: "Themes",
			value: "themes",
		},
		{
			label: "Other",
			value: "other",
		},
	],
	ratings: [4, 3, 2, 1],
	ratingsSuffix: "& up",
	claimedLabel: "Claimed",
	resetFiltersLabel: "Reset Filters",
	initialValues: {
		claimed: false,
		categories: [],
		rating: null,
	},
};
