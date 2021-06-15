import { QRCode, URI } from "@arkecosystem/platform-sdk-support";
import { useCallback, useEffect, useState } from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

interface QRCodeProps {
	network: string;
	coin: string;
	amount: string;
	smartbridge: string;
	address: string;
	method?: string;
}

export const useQRCode = ({ network, amount, address, smartbridge, coin, method }: QRCodeProps) => {
	const [qrCodeData, setQrCodeData] = useState<{ uri?: string; image?: string }>({
		uri: undefined,
		image: undefined,
	});

	const maxLength = 255;

	const formatQR = useCallback(
		({ amount, address, smartbridge, coin, network, method = "transfer" }: QRCodeProps) => {
			const uri = new URI();

			return uri.serialize({
				method,
				coin,
				network,
				recipient: address,
				...(amount && { amount }),
				...(smartbridge && { vendorField: smartbridge?.slice(0, maxLength) }),
			});
		},
		[],
	);

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
			const qrCodeDataUri = address
				? formatQR({ network, amount, address, smartbridge, coin, method })
				: undefined;

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
	}, [amount, smartbridge, network, address, formatQR, coin, method]);

	return qrCodeData;
};
