import { QRCode } from "@arkecosystem/platform-sdk-support";
import { useDarkMode } from "app/hooks";
import { stringify } from "querystring";
import { useCallback, useEffect, useMemo, useState } from "react";

type QRCodeProps = {
	network?: string;
	amount?: string;
	smartbridge?: string;
	address?: string;
};

export const useQRCode = ({ network, amount, address, smartbridge }: QRCodeProps) => {
	const [qrCodeData, setQrCodeData] = useState<{ uri?: string; image?: string } | undefined>();

	const isDark = useDarkMode();

	const formatQR = useCallback(({ network, amount, address, smartbridge }: QRCodeProps) => {
		const uriParams = {
			...(amount && { amount }),
			...(smartbridge && { vendorField: smartbridge }),
		};

		const networkPrefix = network?.split(".")[0];
		const qrParameters = stringify(uriParams);
		return `${networkPrefix}:${address}${qrParameters && `?${qrParameters}`}`;
	}, []);

	const color = useMemo(
		() =>
			isDark
				? {
						dark: "#eef3f5",
						light: "#212225",
				  }
				: {
						dark: "#212225",
						light: "#fff",
				  },
		[isDark],
	);

	useEffect(() => {
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
	}, [amount, color, smartbridge, network, address, formatQR]);

	return { qrCodeData };
};
