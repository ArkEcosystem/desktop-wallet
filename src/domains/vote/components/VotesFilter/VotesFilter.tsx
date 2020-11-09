import { Checkbox } from "app/components/Checkbox";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useState } from "react";

import { FilterProps } from "./";

export const VotesFilter = ({ onChange, defaultOptions }: FilterProps) => {
	const [options, setOptions] = useState(defaultOptions || []);

	const handleChange = (index: number) => {
		const updated = options.map((o) => ({ ...o, isChecked: false }));
		updated.splice(index, 1, { ...updated[index], isChecked: true });

		setOptions(updated);
		onChange?.(updated);
	};

	if (!options.length) return <></>;

	return (
		<div data-testid="VotesFilter">
			<Dropdown
				position="right"
				toggleContent={
					<div className="cursor-pointer">
						<Icon name="Filters" width={20} height={20} />
					</div>
				}
			>
				<div className="w-64 px-6 py-4">
					{options.map(({ label, value, isChecked }, index) => (
						<label
							key={index}
							className="flex items-center block px-2 pb-1 space-x-3 rounded-md cursor-pointer text-theme-secondary-text hover:bg-theme-neutral-contrast"
							data-testid={`VotesFilter__option--${index}`}
						>
							<span>
								<Checkbox
									name={value}
									className="rounded-lg"
									checked={isChecked}
									onChange={() => handleChange(index)}
								/>
							</span>
							<span>{label}</span>
						</label>
					))}
				</div>
			</Dropdown>
		</div>
	);
};
