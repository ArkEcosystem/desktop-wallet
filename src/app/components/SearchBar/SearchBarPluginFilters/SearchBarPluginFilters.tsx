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
	claimedLabel?: string;
	resetFiltersLabel?: string;
	ratings?: number[];
};

const Stars = ({ length = 5, value }: any) => {
	const stars = Array.from({ length });
	return (
		<span className="flex text-theme-neutral-700">
			{stars.map((_, index: number) => {
				return (
					<span key={index} className={`${index < value ? "text-theme-warning-300" : ""} mr-1`}>
						<Icon name={`${index < value ? "Star" : "StarOutline"}`} width={20} height={20} />
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
							className="flex items-center block px-2 pb-1 cursor-pointer space-x-2 text-theme-neutral-700 hover:bg-theme-neutral-100 rounded-md"
							key={rating}
						>
							<span>
								<Checkbox
									name="test"
									type="radio"
									className="rounded-lg mt-px"
									data-testid={`SearchBarPluginFilters-rating-${rating}`}
								/>
							</span>
							<span className="flex items-center mt-1 space-x-1">
								<Stars value={rating} />
								<span>{suffixLabel}</span>
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
							className="flex items-center block px-2 pb-1 mb-1 cursor-pointer space-x-2 text-theme-neutral-700 hover:bg-theme-neutral-100 rounded-md"
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
		<div data-testid="SearchBarPluginFilters" className="relative flex items-center text-theme-primary-400 z-20">
			<Dropdown
				position="right"
				toggleContent={
					<div className="cursor-pointer mr-8">
						<Icon name="Filters" width={20} height={20} />
					</div>
				}
			>
				<div className="w-64 px-6 py-4">
					<label className="flex items-center block px-2 pb-1 cursor-pointer space-x-3 text-theme-neutral-700 hover:bg-theme-neutral-100 rounded-md">
						<span>
							<Checkbox
								name="claim"
								className="rounded-lg"
								data-testid={`SearchBarPluginFilters-claim`}
							/>
						</span>
						<span className="ml-1 mt-1">Claimed</span>
					</label>

					<div className="mt-3 mb-4 border-b border-dashed border-theme-neutral-200" />
					<div className="mb-1 font-semibold text-theme-neutral-700">{categoriesLabel}</div>
					<CategoryCheckboxes categories={categories} />

					<div className="my-4 border-b border-dashed border-theme-neutral-200" />

					<div className="font-semibold text-theme-neutral-700">{ratingsLabel}</div>
					<RatingsCheckboxes ratings={ratings} suffixLabel={ratingsSuffix} />

					<div className="my-4 border-b border-dashed border-theme-neutral-200" />
					<div className="flex items-center text-theme-primary-500 hover:text-theme-primary-600 cursor-pointer pl-2 hover:underline">
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
};
