import { QRCode } from "@arkecosystem/platform-sdk-support";
import { stringify } from "querystring";
import { useCallback, useEffect, useState } from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

type QRCodeProps = {
	network?: string;
	amount?: string;
	smartbridge?: string;
	address?: string;
};

export const useQRCode = ({ network, amount, address, smartbridge }: QRCodeProps) => {
	const [qrCodeData, setQrCodeData] = useState<{ uri?: string; image?: string }>({
		uri: undefined,
		image: undefined,
	});

	const maxLength = 255;

	const formatQR = useCallback(({ network, amount, address, smartbridge }: QRCodeProps) => {
		const uriParams = {
			...(amount && { amount }),
			...(smartbridge && { vendorField: smartbridge?.slice(0, maxLength) }),
		};

		const networkPrefix = network?.split(".")[0];
		const qrParameters = stringify(uriParams);
		return `${networkPrefix}:${address}${qrParameters && `?${qrParameters}`}`;
	}, []);

	useEffect(() => {
		const color = shouldUseDarkColors()
			? {
					dark: "#eef3f5",
					light: "#212225",
			  }
			: {
					dark: "#212225",
					light: "#fff",
			  };

		const generateQrCode = async () => {
			const qrCodeDataUri = address ? formatQR({ network, amount, address, smartbridge }) : undefined;

			let qrCodeDataImage: string | undefined;

			try {
				qrCodeDataImage = await QRCode.fromString(qrCodeDataUri!).toDataURL({ width: 250, margin: 0, color });
			} catch {
				qrCodeDataImage = undefined;
			}

			setQrCodeData({
				uri: qrCodeDataUri,
				image: qrCodeDataImage,
			});
		};

		generateQrCode();
	}, [amount, smartbridge, network, address, formatQR]);

	return qrCodeData;
};
