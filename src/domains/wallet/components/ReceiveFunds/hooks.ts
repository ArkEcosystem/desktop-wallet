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
	const [qrCode, setQrCode] = useState<string | undefined>();
	const [qrCodeDataUri, setQrCodeDataUri] = useState<string | undefined>();

	const formatQR = useCallback(({ network, amount, address, smartbridge }: QRCodeProps) => {
		const uriParams = {
			...(amount && { amount }),
			...(smartbridge && { smartbridge }),
		};

		const networkPrefix = network?.split(".")[0];
		const qrParameters = stringify(uriParams);
		return `${networkPrefix}:${address}${qrParameters && `?${qrParameters}`}`;
	}, []);

	useEffect(() => {
		const generateQrCode = async () => {
			const qrCode = formatQR({ network, amount, address, smartbridge });
			const qrCodeDataUri = address
				? await QRCode.fromString(qrCode).toDataURL({ width: 250, margin: 0 })
				: undefined;

			setQrCode(qrCode);
			setQrCodeDataUri(qrCodeDataUri);
		};

		generateQrCode();
	}, [amount, smartbridge, network, address, formatQR]);

	return { qrCode, qrCodeDataUri };
};
