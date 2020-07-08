import { Alert } from "app/components/Alert";
import { Slider } from "app/components/Slider";
import React from "react";

type Props = {
	about: string;
	permissions: any;
	screenshots: any;
};

export const PluginInfo = ({ about, permissions, screenshots }: Props) => (
	<div className="p-10 mt-5 bg-theme-background">
		<div>
			<p className="font-bold">About the plugin</p>
			<p className="mt-3 text-theme-neutral-600" data-testid="plugin-info__about">
				{about}
			</p>
		</div>
		<div className="mt-10">
			<p className="font-bold">Permissions</p>
			<p className="mt-3 text-theme-neutral-600" data-testid="plugin-info__permissions">
				{permissions.join(", ")}
			</p>
		</div>
		<div className="relative mt-10">
			<p className="font-bold">Screenshots</p>
			<div
				className="absolute top-0 right-0 flex pr-4 space-x-3 screenshots-pagination"
				data-testid="plugin-info__screenshots--pagination"
			/>
			<div className="pb-10">
				<Slider
					data={[screenshots, screenshots, screenshots]}
					options={{
						pagination: {
							el: ".screenshots-pagination",
							clickable: true,
						},
					}}
				>
					{(screenshotGroup: any) => (
						<div className="flex pb-10 mt-3 mr-3 space-x-4">
							{screenshotGroup.map((screenshot: any, idx: number) => (
								<div
									data-testid="plugin-info__screenshot"
									key={idx}
									className="w-1/3 h-56 rounded-lg bg-theme-neutral"
								/>
							))}
						</div>
					)}
				</Slider>
			</div>
			<div className="pb-10">
				<Alert variant="warning" title="Disclaimer">
					The availability of this plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK
					SCIC is directly involved in the development or affiliated with the developer providing this plugin.
					By installing it on your wallet, you assume every responsibility
				</Alert>
			</div>
		</div>
	</div>
);
