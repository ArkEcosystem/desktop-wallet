export const Scheduler = (interval = 300000) => ({
	schedule: (actions: any, done: Function) => {
		for (const action of actions) {
			setInterval(() => action(), interval);

			return done && setTimeout(() => done(), interval + 500);
		}
	},
});
