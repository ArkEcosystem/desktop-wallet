export interface CustomSelector extends Selector {
	innerHTML: Promise<any>;
}

export interface CustomSnapshot extends NodeSnapshot {
	innerHTML: string;
}
