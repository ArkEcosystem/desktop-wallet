import { Icon } from "app/components/Icon";
import Downshift from "downshift";
import React from "react";

type Props = {
	options?: any;
	option?: any;
	toggle?: any;
};

export const SelectDropdown = ({ toggle, options, option }: Props) => {
	const renderOption = (rowData: any) => {
		if (typeof option === "function") return option(rowData);
	};

	const renderToggle = (selected: any, isOpen: boolean) => {
		if (typeof toggle === "function") return toggle(selected, isOpen);
	};

	return (
		<Downshift itemToString={(i) => i.value}>
			{({ getLabelProps, getInputProps, getItemProps, isOpen, toggleMenu, selectedItem }) => (
				<div className="relative">
					<label {...getLabelProps({ htmlFor: "dropdown-select" })}>
						<div className="relative flex flex-inline items-center w-full">
							<div className="flex m-h-20 cursor-pointer overflow-hidden shadow-sm w-full bg-theme-background rounded border border-theme-neutral-300 py-3 px-4 text-theme-neutral-900 transition-colors duration-200 hover:outline-none hover:border-theme-primary pr-12">
								{renderToggle(selectedItem, isOpen)}
							</div>
							<div className="-ml-12 w-12 px-4 py-5 text-lg pointer-events-none text-theme-neutral-dark">
								<div className={isOpen ? "transform rotate-180" : ""}>
									<Icon name="ChevronDown" />
								</div>
							</div>
						</div>
					</label>

					<div className="btn-group relative">
						<input {...getInputProps({ readOnly: true })} type="hidden" />
						<button
							id="dropdown-select"
							data-testid="select-dropdown__toggle"
							type="button"
							className="dropdown-toggle"
							onClick={(params: any) => toggleMenu(params)}
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded={isOpen}
						></button>
						{isOpen ? (
							<div
								data-testid="select-dropdown__content"
								className="absolute w-full z-10 -mt-3 bg-theme-background rounded-lg shadow-xl border-theme-neutral-100 border-1"
							>
								{options.map((item: any, index: number) => (
									<div
										{...getItemProps({ item })}
										key={index}
										data-testid={`select-dropdown__option-${index}`}
										className="dropdown-item cursor-pointer"
										style={{ cursor: "pointer" }}
									>
										{renderOption(item)}
									</div>
								))}
							</div>
						) : null}
					</div>
				</div>
			)}
		</Downshift>
	);
};

SelectDropdown.defaultProps = {
	options: [],
};
