import { Circle } from "app/components/Circle";
import Downshift from "downshift";
import React from "react";

export const SelectAsset = () => {
	return (
		<Downshift itemToString={(i) => i?.value}>
			{({ getLabelProps, getInputProps }) => (
				<div className="relative">
					<label {...getLabelProps({ htmlFor: "dropdown-select" })}>
						<div className="relative flex items-center w-full flex-inline">
							<div className="flex w-full border rounded shadow-sm bg-theme-background border-theme-neutral-300 transition-colors duration-200 hover:outline-none hover:border-theme-primary">
								<div className="flex-0 w-12 p-2">
									<Circle size="small" noShadow className="border-theme-neutral-200" />
								</div>
								<div className="font-semibold text-theme-neutral-800 flex-1 p-1">
									<input {...getInputProps()} className="h-full w-full outline-none" />
								</div>
							</div>
						</div>
					</label>
				</div>
			)}
		</Downshift>
	);
};

SelectAsset.defaultProps = {
	options: [],
};
