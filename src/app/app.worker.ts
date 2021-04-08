import { expose } from "threads/worker";

expose({
	runTest: () => {
		console.log("runinng worker");
	},
});
