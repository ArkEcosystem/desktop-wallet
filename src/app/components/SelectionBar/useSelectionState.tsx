import React from "react";

export function useSelectionState(defaultValue: string | number | undefined) {
	const [checkedValue, setCheckedValue] = React.useState<string | number | undefined>(defaultValue);
	const isValueChecked = React.useCallback((value: string | number) => checkedValue === value, [checkedValue]);

	return { checkedValue, setCheckedValue, isValueChecked };
}
