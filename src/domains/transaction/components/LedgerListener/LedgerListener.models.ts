// @ts-ignore - Could not find a declaration file for module '@ledgerhq/devices'.
import { DeviceModelId } from "@ledgerhq/devices";

export interface LedgerDevice {
	type: string;
	path: string;
	modelId: DeviceModelId;
}

export interface LedgerDevicesState {
	currentDevice?: LedgerDevice;
	devices: LedgerDevice[];
}
