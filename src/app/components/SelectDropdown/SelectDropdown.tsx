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
						<div className="relative flex items-center w-full flex-inline">
							<div className="flex w-full px-4 py-3 pr-12 overflow-hidden border rounded cursor-pointer m-h-20 shadow-sm bg-theme-background border-theme-neutral-300 text-theme-neutral-900 transition-colors duration-200 hover:outline-none hover:border-theme-primary">
								{renderToggle(selectedItem, isOpen)}
							</div>
							<div className="w-12 px-4 py-5 -ml-12 text-lg pointer-events-none text-theme-neutral-dark">
								<div className={isOpen ? "transform rotate-180" : ""}>
									<Icon name="ChevronDown" />
								</div>
							</div>
						</div>
					</label>

					<div className="relative btn-group">
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
						/>
						{isOpen ? (
							<div
								data-testid="select-dropdown__content"
								className="absolute z-10 w-full -mt-3 rounded-lg shadow-xl bg-theme-background border-theme-neutral-100 border-1"
							>
								{options.map((item: any, index: number) => (
									<div
										{...getItemProps({ item })}
										key={index}
										data-testid={`select-dropdown__option-${index}`}
										className="cursor-pointer dropdown-item"
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
