import { Contracts, Profile } from "@arkecosystem/platform-sdk-profiles";
import { AssertionError } from "assert";

export function assertProfile(profile?: Contracts.IProfile): asserts profile is Profile {
	if (!(profile instanceof Profile)) {
		throw new AssertionError({
			message: `Expected 'profile' to be defined, but received ${profile}`,
		});
	}
}

export function assertString(value: unknown): asserts value is NonNullable<string> {
	if (typeof value !== "string" || value.trim() === "") {
		throw new AssertionError({
			message: `Expected 'value' to be string, but received ${value}`,
		});
	}
}

export function assertNumber(value: unknown): asserts value is NonNullable<number> {
	if (typeof value !== "number" || value > Number.MAX_SAFE_INTEGER || Number.isNaN(value)) {
		throw new AssertionError({
			message: `Expected 'value' to be number, but received ${value}`,
		});
	}
}
