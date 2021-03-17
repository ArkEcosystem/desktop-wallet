/* eslint-disable arrow-body-style */
import { usePluginManagerContext } from "plugins";
import { useCallback, useEffect, useRef, useState } from "react";

export const usePluginUpdateQueue = () => {
	const [queue, setQueue] = useState<string[]>([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdateCompleted, setIsUpdateCompleted] = useState(false);
	const { updatePlugin } = usePluginManagerContext();
	const initialQueueRef = useRef<string[]>([]);

	const currentId = queue[0];

	const startUpdate = (ids: string[]) => {
		initialQueueRef.current = ids;
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
		return initialQueueRef.current.indexOf(id) >= 0 && !hasInUpdateQueue(id);
	};

	const hasInUpdateQueue = (id: string) => {
		return queue.indexOf(id) >= 0;
	};

	useEffect(() => {
		if (!isUpdating) {
			return;
		}

		if (!queue.length) {
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
