/* eslint-disable @typescript-eslint/require-await */

import { act, renderHook } from "@testing-library/react-hooks";
import * as utils from "utils/electron-utils";
import { waitFor } from "utils/testing-library";

import { useQRCode } from "./";

describe("useQRCode hook", () => {
	let darkModeSpy = jest.spyInstance;

	beforeEach(() => {
		darkModeSpy = jest.spyOn(utils, "shouldUseDarkColors").mockReturnValue(false);
	});

	afterEach(() => {
		darkModeSpy.mockRestore();
	});

	it("should generate qr code", async () => {
		let hook: any;
		await act(async () => {
			hook = renderHook(() =>
				useQRCode({
					amount: "10",
					smartbridge: "test",
					network: "ark",
					address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				}),
			);
		});

		await act(async () => {
			await waitFor(() =>
				expect(hook.result.current.uri).toBe(
					"ark:D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD?amount=10&vendorField=test",
				),
			);

			const expectedImageData =
				"data:image/png;base64,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";

			await waitFor(() => expect(hook.result.current.image).toBe(expectedImageData));
		});
	});

	it("should generate without amount and smartbridge", async () => {
		let hook: any;
		await act(async () => {
			hook = renderHook(() =>
				useQRCode({
					network: "ark",
					address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				}),
			);
		});

		await act(async () => {
			await waitFor(() => expect(hook.result.current.uri).toBe("ark:D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"));

			const expectedImageData =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAAAklEQVR4AewaftIAAAdhSURBVO3BUW4c2a5FwS1CE2kS5vzHQ4Ccip5/LxrI40aW8pXoFfHxj//60l9munTFI/UupksnHqktpksnHqmT6dIVj9TfxARgPROA9UwA1jMBWM8EYD0TgPVMANYzAVjvU39guvRTeKSeMF26yyP1CtOlKx6pk+nSFY/Uu5guPWG69FN4pK6YAKxnArCeCcB6JgDrmQCsZwKwngnAeiYA633qRTxST5gufbfp0olH6mS69ASP1HebLr2CR+ouj9TJdOm7eaSeMF26ywRgPROA9UwA1jMBWM8EYD0TgPVMANb7FP7FI/WE6dKJR+pkunTFI3XikXrCdOmu6RL+GxOA9UwA1jMBWM8EYD0TgPVMANYzAVjPBGC9T+FfpksnHqm7PFLvYrp0xSN1Ml068UjdNV3Cf2MCsJ4JwHomAOuZAKxnArCeCcB6JgDrmQCs96kXmS7hv5kunXikTjxS3226dOKROpkuXfFI/RTTpZ/CBGA9E4D1TADWMwFYzwRgPROA9UwA1vvUH/BI/U08UifTpROP1JXp0itMl654pO7ySJ1Ml048UlemSyceqZPp0l0eqS1MANYzAVjPBGA9E4D1TADWMwFYzwRgPROA9T6nS/j/4ZE6mS69g+nSiUfqZLp013TprunS38QEYD0TgPVMANYzAVjPBGA9E4D1TADW+/jHf33pYLp04pG6a7p04pH6btOlJ3iknjBdOvFIXZkunXikTqZL78AjdTJdussjdTJduuKRussEYD0TgPVMANYzAVjPBGA9E4D1TADWMwFY73O69ITp0hOmS0/wSP1NPFIn06UneKROpkvfzSN1Ml068UhdmS6deKSumACsZwKwngnAeiYA65kArGcCsJ4JwHomAOt9fP2mA4/UyXTpLo/UyXTpikfqZLp0xSP1CtOluzxSd02XnuCRumu6dOKRumu6dOKRujJd+ilMANYzAVjPBGA9E4D1TADWMwFYzwRgvY9//NeXXmC6dMUj9YTp0olH6sp06W/jkboyXXqCR+oVpkt3eaSuTJee4JE6mS5dMQFYzwRgPROA9UwA1jMBWM8EYD0TgPVMANb7+Md/felgunTikboyXTrxSD1hunSXR+pkunTFI/UK06UrHql3MV26yyN1Ml3awiN1lwnAeiYA65kArGcCsJ4JwHomAOuZAKxnArDex9dvOvBIvYvp0l0eqXcwXXqCR+qu6dKJR+qnmC49wSN113TpxCN1xQRgPROA9UwA1jMBWM8EYD0TgPVMANb71ItMl57gkbpruvRTeKTumi69i+nSFY/UEzxSd02XXmG6dMUjdZcJwHomAOuZAKxnArCeCcB6JgDrmQCsZwKw3sfXbzrwSL2L6dJ380i9wnTpHXikTqZLm3ikrkyX7vJInUyX7vJI3WUCsJ4JwHomAOuZAKxnArCeCcB6JgDrfepFpktXPFIn06UTj9QWHqlXmC59N4/UE6ZLm3ikTqZLV6ZLd5kArGcCsJ4JwHomAOuZAKxnArCeCcB6JgDrfXz9pjfhkbprunTikXoH06UneKTumi6deKROpkvvwCN1Ml26yyP1hOnSFROA9UwA1jMBWM8EYD0TgPVMANYzAVjPBGC9j3/815cOpkt3eaReYbp0xSN113TpxCN1Ml264pHC/5ouPcEjdTJd2sIEYD0TgPVMANYzAVjPBGA9E4D1TADW+/j6TQ/wSD1hunSXR+oJ06VX8EjdNV264pF6F9OlJ3ikrkyXTjxST5guXTEBWM8EYD0TgPVMANYzAVjPBGA9E4D1TADW+/j6TQceqU2mS1c8Uu9iunTikcJ7mi6deKSuTJdOPFJXTADWMwFYzwRgPROA9UwA1jMBWM8EYD0TgPU+9QemS3hf06W7PFJ3TZee4JE6mS59N4/UK0yXrnik7jIBWM8EYD0TgPVMANYzAVjPBGA9E4D1Pj1Sf5vp0l3TpROP1F0eqZPp0hWP1Ml06S6P1Ml06YpH6gkeqZPp0k8xXbpiArCeCcB6JgDrmQCsZwKwngnAeiYA65kArPepPzBd+ik8Un8bj9RdHqm7pkt3TZdOPFJ3TZd+iunSXSYA65kArGcCsJ4JwHomAOuZAKxnArDep17EI/WE6dJ3my6deKROpktXPFKvMF26yyN1Zbp04pG6a7r0Ch6pd+CRumu6dJcJwHomAOuZAKxnArCeCcB6JgDrmQCsZwKw3qfwLx6pk+nSE6ZLT5guXfFI/STTpbs8UlemS6/gkbrLI3XFBGA9E4D1TADWMwFYzwRgPROA9UwA1jMBWO9T+DYeqSvTpVfwSN01XbprunSXR+pkunTikboyXXqCR+odmACsZwKwngnAeiYA65kArGcCsJ4JwHqfepHp0hbTpROP1Ml06YpHCv+dR+pkuvQOpkt3eaROpktXTADWMwFYzwRgPROA9UwA1jMBWM8EYD0TgPU+9Qc8Un8Tj9QTpksnHqm7pktP8Ej9FB6pk+nSXR6pk+nSdzMBWM8EYD0TgPVMANYzAVjPBGA9E4D1/g8QoA+/VxqxHgAAAABJRU5ErkJggg==";

			await waitFor(() => expect(hook.result.current.image).toBe(expectedImageData));
		});
	});

	it("should return undefined if address is not provided", async () => {
		await act(async () => {
			const { result } = renderHook(() => useQRCode({ network: "ark" }));
			await waitFor(() => expect(result.current.uri).toBe(undefined));
			await waitFor(() => expect(result.current.image).toBe(undefined));
		});
	});
});
