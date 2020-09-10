import { File } from "@arkecosystem/platform-sdk-ipfs";
import { TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";

export const fetchTxIpfsData = async (tx: TransactionData) => {
	const data = tx.asset().data as { ipfsData: string };
	return await new File(httpClient).get(data.ipfsData);
};
