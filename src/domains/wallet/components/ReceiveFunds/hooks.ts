import { QRCode } from "@arkecosystem/platform-sdk-support";
import { stringify } from "querystring";
import { useCallback, useEffect, useState } from "react";

type QRCodeProps = {
	network?: string;
	amount?: string;
	smartbridge?: string;
	address?: string;
};

export const useQRCode = ({ network, amount, address, smartbridge }: QRCodeProps) => {
	const [qrCodeDataUri, setQrCodeDataUri] = useState<string | undefined>();
	const [qrCodeDataImage, setQrCodeDataImage] = useState<string | undefined>();

	const formatQR = useCallback(({ network, amount, address, smartbridge }: QRCodeProps) => {
		const uriParams = {
			...(amount && { amount }),
			...(smartbridge && { vendorField: smartbridge }),
		};

		const networkPrefix = network?.split(".")[0];
		const qrParameters = stringify(uriParams);
		return `${networkPrefix}:${address}${qrParameters && `?${qrParameters}`}`;
	}, []);

	useEffect(() => {
		const generateQrCode = async () => {
			const qrCodeDataUri = address ? formatQR({ network, amount, address, smartbridge }) : undefined;
			const qrCodeDataImage = qrCodeDataUri
				? await QRCode.fromString(qrCodeDataUri).toDataURL({ width: 250, margin: 0 })
				: undefined;

			setQrCodeDataUri(qrCodeDataUri);
			setQrCodeDataImage(qrCodeDataImage);
		};

		generateQrCode();
	}, [amount, smartbridge, network, address, formatQR]);

	return { qrCodeDataUri, qrCodeDataImage };
};
