/**
 * @clickOutsideHandler
 *
 * `useEffect` hook function that calls `callback`
 *  when a click is triggered outside of ref element.
 */
export const clickOutsideHandler = (ref: any, callback: any) => {
	// Check if clicked outside of the ref element
	const handleClickOutside = (event: any) => {
		if (ref.current && !ref.current.contains(event.target)) {
			if (typeof callback === "function") callback();
		}
	};

	// Listen to click events
	document.addEventListener("mousedown", handleClickOutside);

	// Unbind listener on clean up
	return () => document.removeEventListener("mousedown", handleClickOutside);
};
