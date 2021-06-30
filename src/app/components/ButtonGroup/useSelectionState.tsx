import React from "react";

export function useSelectionState(defaultValue: string | number | undefined) {
	const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(defaultValue);
	const isSelected = React.useCallback((value: string | number) => selectedValue === value, [selectedValue]);

	return { isSelected, selectedValue, setSelectedValue };
}
