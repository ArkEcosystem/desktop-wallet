export const debounceAsync = (callback: Function, delay: number) => {
	let timeout: any;
	console.log("hello dudes i am real");

	return async function (...args: any) {
		return new Promise((resolve) => {
			clearTimeout(timeout);
			timeout = setTimeout(async () => {
				// @ts-ignore
				const response = await callback.apply(this, args);
				resolve(response);
			}, delay);
		});
	};
};
