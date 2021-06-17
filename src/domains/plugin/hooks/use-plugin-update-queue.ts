/* eslint-disable arrow-body-style */
import { usePluginManagerContext } from "plugins";
import { useCallback, useEffect, useRef, useState } from "react";

export const usePluginUpdateQueue = () => {
	const [queue, setQueue] = useState<string[]>([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateCompleted, setIsUpdateCompleted] = useState(false);
	const { updatePlugin } = usePluginManagerContext();
	const initialQueueReference = useRef<string[]>([]);

	const currentId = queue[0];

	const startUpdate = (ids: string[]) => {
		initialQueueReference.current = ids;
		setQueue(ids);
		setIsUpdating(true);
		setIsUpdateCompleted(false);
	};

	const next = () => {
		setQueue((current) => current.slice(1));
	};

	const update = useCallback(async () => {
		await updatePlugin(currentId);
		setTimeout(() => next(), 0);
	}, [currentId]); // eslint-disable-line react-hooks/exhaustive-deps

	const hasUpdateComplete = (id: string) => {
		return initialQueueReference.current.includes(id) && !hasInUpdateQueue(id);
	};

	const hasInUpdateQueue = (id: string) => {
		return queue.includes(id);
	};

	useEffect(() => {
		if (!isUpdating) {
			return;
		}

		if (queue.length === 0) {
			setIsUpdating(false);
			setIsUpdateCompleted(true);
			return;
		}

		update();
	}, [isUpdating, queue, update]);

	return {
		startUpdate,
		isUpdateCompleted,
		isUpdating,
		hasInUpdateQueue,
		hasUpdateComplete,
	};
};
