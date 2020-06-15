import React from "react";

export function useRadioState(defaultValue: string | number | undefined) {
	const [checkedValue, setCheckedValue] = React.useState<string | number | undefined>(defaultValue);
	const isValueChecked = React.useCallback((value: string | number) => checkedValue === value, [checkedValue]);

	return { checkedValue, setCheckedValue, isValueChecked };
}
