import { useCallback, useEffect } from "react";

export const useModal = ({ isOpen, onClose }: { isOpen: boolean; onClose?: any }) => {
	useEffect(() => {
		document.body.style.overflow = "overlay";

		if (isOpen) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "overlay";
			return;
		};
	}, [isOpen]);

	const onEscKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		},
		[onClose],
	);

	useEffect(() => {
		document.addEventListener("keyup", onEscKey, false);

		return () => {
			document.removeEventListener("keyup", onEscKey);
		};
	}, [onEscKey]);
};
