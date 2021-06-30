import { QRCode, URI } from "@arkecosystem/platform-sdk-support";
import { useCallback, useEffect, useState } from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

interface QRCodeProperties {
	network: string;
	coin: string;
	amount: string;
	memo: string;
	address: string;
	method?: string;
}

export const useQRCode = ({ network, amount, address, memo, coin, method }: QRCodeProperties) => {
	const [qrCodeData, setQrCodeData] = useState<{ uri?: string; image?: string }>({
		image: undefined,
		uri: undefined,
	});

	const maxLength = 255;

	const formatQR = useCallback(({ amount, address, memo, coin, network, method = "transfer" }: QRCodeProperties) => {
		const uri = new URI();

		return uri.serialize({
			coin,
			method,
			network,
			recipient: address,
			...(amount && { amount }),
			...(memo && { memo: memo?.slice(0, maxLength) }),
		});
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
			const qrCodeDataUri = address ? formatQR({ address, amount, coin, memo, method, network }) : undefined;

			let qrCodeDataImage: string | undefined;

			try {
				qrCodeDataImage = await QRCode.fromString(qrCodeDataUri!).toDataURL({ color, margin: 0, width: 250 });
			} catch {
				qrCodeDataImage = undefined;
			}

			setQrCodeData({
				image: qrCodeDataImage,
				uri: qrCodeDataUri,
			});
		};

		generateQrCode();
	}, [amount, memo, network, address, formatQR, coin, method]);

	return qrCodeData;
};
