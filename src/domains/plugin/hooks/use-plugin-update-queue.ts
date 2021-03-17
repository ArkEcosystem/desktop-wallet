/* eslint-disable arrow-body-style */
import { useCallback, useEffect, useState } from "react";

export const usePluginUpdateQueue = (ids: string[]) => {
	const [queue, setQueue] = useState<string[]>([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	const currentId = queue[0];

	const start = () => {
		setQueue(ids);
		setIsUpdating(true);
		setIsCompleted(false);
	};

	const next = () => {
		setQueue((current) => current.slice(1));
	};

	const update = useCallback(async () => {
		// TODO:
		console.log("update", currentId);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		next();
	}, [currentId]);

	const hasInQueue = (id: string) => {
		return queue.indexOf(id) > 0;
	};

	useEffect(() => {
		if (!isUpdating) {
			return;
		}

		if (!queue.length) {
			setIsUpdating(false);
			setIsCompleted(true);
			return;
		}

		update();
	}, [isUpdating, queue, update]);

	return {
		start,
		isCompleted,
		isUpdating,
		hasInQueue,
	};
};
