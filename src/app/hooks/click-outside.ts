/**
 * @clickOutsideHandler
 *
 * `useEffect` hook function that calls `callback`
 *  when a click is triggered outside of ref element.
 */
export const clickOutsideHandler = (reference: any, callback: any) => {
	// Check if clicked outside of the ref element
	const handleClickOutside = (event: MouseEvent) => {
		if (reference.current && !reference.current.contains(event.target) && typeof callback === "function") {
				callback();
			}
	};

	// Listen to click events
	document.addEventListener("mousedown", handleClickOutside);

	// Unbind listener on clean up
	return () => document.removeEventListener("mousedown", handleClickOutside);
};
