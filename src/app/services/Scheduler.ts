export class Scheduler {
	interval: number;

	constructor(interval = 300000) {
		this.interval = interval;
	}

	public schedule(jobs: any, done: Function) {
		for (const job of jobs) {
			console.info(`Scheduling action ${job.name} for every ${this.interval / 60000} mins`);

			setInterval(() => job(), this.interval);
		}

		if (done) {
			// Run a done action once all timers runned
			console.info(`Scheduling done callback for the next ${(this.interval + 500) / 60000} mins`);
			return setTimeout(() => done(), this.interval + 500);
		}
	}
}
