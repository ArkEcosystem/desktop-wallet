import { Checkbox } from "app/components/Checkbox";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";

type Category = {
	label: string;
	value: string | number;
};
type FilterProps = {
	categoriesLabel?: string;
	categories: Category[];
	ratingsLabel?: string;
	ratingsSuffix?: string;
	ratings?: number[];
};

const Stars = ({ length = 5, value }: any) => {
	const stars = Array.from({ length });
	return (
		<span className="flex text-theme-neutral-200 space-x-1">
			{stars.map((_, index: number) => {
				return (
					<span key={index} className={`${index < value ? "text-theme-warning-300" : ""}`}>
						<Icon name="Star" width={20} height={20} />
					</span>
				);
			})}
		</span>
	);
};

const RatingsCheckboxes = ({ ratings, suffixLabel }: any) => {
	return (
		<fieldset>
			{ratings &&
				ratings.map((rating: number) => {
					return (
						<label
							className="flex items-center block mt-2 cursor-pointer space-x-3 text-theme-neutral-700"
							key={rating}
						>
							<span>
								<Checkbox
									className="w-2"
									name="rating"
									data-testid={`SearchBarPluginFilters-rating-${rating}`}
								/>
							</span>
							<span className="flex items-center mt-1 space-x-2">
								<Stars value={rating} />
								{rating > 1 && <span>{suffixLabel}</span>}
							</span>
						</label>
					);
				})}
		</fieldset>
	);
};

const CategoryCheckboxes = ({ categories }: any) => {
	return (
		<fieldset>
			{categories &&
				categories.map((category: Category, index: number) => {
					return (
						<label
							className="flex items-center block mt-2 cursor-pointer space-x-3 text-theme-neutral-700"
							key={index}
						>
							<span>
								<Checkbox
									name="category"
									data-testid={`SearchBarPluginFilters-category-${category.value}`}
								/>
							</span>
							<span className="mt-1">{category.label}</span>
						</label>
					);
				})}
		</fieldset>
	);
};

export const SearchBarPluginFilters = ({
	categories,
	ratings,
	ratingsLabel,
	ratingsSuffix,
	categoriesLabel,
}: FilterProps) => {
	return (
		<div data-testid="SearchBarPluginFilters" className="relative flex items-center pr-8 text-theme-primary-400">
			<Dropdown position="left" toggleIcon="Filters">
				<div className="w-64 px-8 py-6">
					<div className="mb-2 font-semibold text-theme-neutral-700">{categoriesLabel}</div>
					<CategoryCheckboxes categories={categories} />

					<div className="my-8 border-b border-theme-neutral-200" />

					<div className="mb-2 font-semibold text-theme-neutral-700">{ratingsLabel}</div>
					<RatingsCheckboxes ratings={ratings} suffixLabel={ratingsSuffix} />
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
	ratings: [5, 4, 3, 2, 1],
	ratingsSuffix: "& up",
};
