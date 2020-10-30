import { useEffect, useRef } from "react";

export const usePrevious = (value: any) => {
	const ref = useRef();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
};
