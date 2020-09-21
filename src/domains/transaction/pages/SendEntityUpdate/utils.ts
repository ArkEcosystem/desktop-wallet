import { File } from "@arkecosystem/platform-sdk-ipfs";
import { Enums, ReadWriteWallet, TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { filter, isEmpty } from "@arkecosystem/utils";
import { httpClient } from "app/services";

type SignEntityUpdateProps = {
	form: any;
	senderWallet: ReadWriteWallet;
	env: any;
	type?: number;
};

export const fetchTxIpfsData = async (tx: TransactionData) => {
	const data = tx.asset().data as { ipfsData: string };
	const ipfsData = await new File(httpClient).get(data.ipfsData);

	if (!ipfsData) throw new Error(`Unable to find Ipfs Data for ${tx.id()}`);
	return ipfsData;
};

export const sendEntityUpdateTransaction = async ({ form, senderWallet, env, type }: SignEntityUpdateProps) => {
	const { fee, ipfsData, mnemonic, secondMnemonic, registrationId } = form.getValues();

	const sanitizedData = filter(ipfsData, (item) => !isEmpty(item));
	const entityType = type ?? Enums.EntityType.Business;

	const transactionId = await senderWallet.transaction().signEntityUpdate({
		fee,
		from: senderWallet.address(),
		sign: { mnemonic, secondMnemonic },
		data: {
			registrationId,
			type: entityType,
			// @TODO: let the user choose what sub-type they wish to use.
			subType: Enums.EntitySubType.None,
			ipfs: await new File(httpClient).upload(sanitizedData),
		},
	});

	await senderWallet.transaction().broadcast(transactionId);
	await env.persist();

	return senderWallet.transaction().transaction(transactionId);
};
