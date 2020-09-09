import { File } from "@arkecosystem/platform-sdk-ipfs";
import { TransactionData } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";

type ResourceLink = {
	value: string;
	type: string;
};

// Map links to match to `LinkCollection` data type
const mapIpfsLinks = (links: ResourceLink[] = []) =>
	links.map(({ value, type }: ResourceLink) => ({ link: value, type }));

const parseIpfsData = ({ meta, socialMedia, sourceControl, videos, images }: any) => ({
	displayName: meta.displayName,
	description: meta.description,
	repositoryLinks: mapIpfsLinks(sourceControl),
	socialMediaLinks: mapIpfsLinks(socialMedia),
	imageLinks: mapIpfsLinks(images),
	videoLinks: mapIpfsLinks(videos),
});

export const fetchTxIpfsData = async (tx: TransactionData) => {
	const data = tx.asset().data as { ipfsData: string };
	const ipfsData: any = await new File(httpClient).get(data.ipfsData);
	return parseIpfsData(ipfsData);
};
