import { useEffect, useRef, useState } from "react";

type Observer = {
	fn: (args: any) => void;
	once?: boolean;
};

export function useObserver <T>(defaultValue: T) {
	const observers = useRef<Observer[]>([]);
	const [value, setValue] = useState(defaultValue);

	const subscribe = (fn: (value: T) => void, { once }: { once?: boolean } = {}) => {
		observers.current.push({ fn, once });
	};

	const notify = (value: T) => {
		const newObservers = [];

		for (const listener of observers.current) {
			listener.fn(value);

			if (!listener.once) {
				newObservers.push(listener);
			}
		}

		observers.current = newObservers;
		setValue(value);
	};

	// eslint-disable-next-line arrow-body-style
	useEffect(() => {
		return () => {
			observers.current = [];
		};
	});

	return {
		value,
		subscribe,
		notify,
	};
};
