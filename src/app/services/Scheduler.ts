export const Scheduler = (interval = 300000) => ({
	schedule: (actions: function, done: function) => {
		for (const action of actions) {
			console.log(`Scheduling action ${action.name} for every ${interval / 60000} mins`);

			setInterval(() => action(), interval);

			// Run a done action once all timers runned
			return done && setTimeout(() => done(), interval + 500);
		}
	},
});
