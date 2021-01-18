const setStyles = (styles: Record<string, any>, element: Element) => {
	Object.assign(element.style, styles);
};

const numberFromPixels = (value: string): number => (value ? parseInt(value.replace("px", "")) : 0);

export const resizeDropdownsHandler = (eventOrReference: any, initialHeight?: number) => {
	const OFFSET = 30;

	const dropdownToggles = (eventOrReference.current || document).querySelectorAll('[data-testid="dropdown__toggle"]');

	for (const toggle of dropdownToggles) {
		const dropdown = toggle.parentElement.querySelector('[data-testid="dropdown__content"]');

		if (!dropdown) {
			continue;
		}

		const toggleHeight: number = toggle.parentElement.offsetHeight;

		const spaceBefore: number = (toggle.getBoundingClientRect().top as number) + document.documentElement.scrollTop;
		const spaceAfter: number = document.body.clientHeight - (spaceBefore + toggleHeight);

		setStyles({ height: null, marginTop: null }, dropdown);

		const styles = getComputedStyle(dropdown);

		if (
			spaceAfter < (dropdown.offsetHeight as number) + numberFromPixels(styles.marginTop) + OFFSET &&
			spaceBefore > (dropdown.offsetHeight as number) + numberFromPixels(styles.marginTop) + OFFSET
		) {
			setStyles(
				{
					marginTop: `-${
						(dropdown.offsetHeight as number) + toggleHeight + numberFromPixels(styles.marginTop)
					}px`,
				},
				dropdown,
			);
		} else {
			setStyles(
				{
					height: `${spaceAfter - numberFromPixels(styles.marginTop) - OFFSET}px`,
					marginTop: null,
					overflowY: "scroll",
				},
				dropdown,
			);

			if (
				dropdown.clientHeight >=
				(dropdown.firstElementChild.clientHeight as number) +
					numberFromPixels(styles.paddingTop) +
					numberFromPixels(styles.paddingBottom)
			) {
				setStyles(
					{
						height: null,
						overflowY: "visible",
					},
					dropdown,
				);
			}
		}

		setStyles({ opacity: 100 }, dropdown);
	}
};
