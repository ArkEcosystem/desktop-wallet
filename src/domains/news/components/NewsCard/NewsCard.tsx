import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import React from "react";

export const NewsCard = () => (
	<Card>
		<div className="flex flex-col p-4 space-y-8">
			<div className="flex justify-between w-full">
				<div className="flex items-center space-x-2">
					<Circle className="text-theme-danger-400 border-theme-danger-200" size="lg">
						<Icon name="Ark" />
					</Circle>

					<div>
						<p className="text-lg font-semibold">ARK Ecosystem</p>

						<div className="flex items-center space-x-2">
							<p className="text-sm font-semibold text-theme-neutral">Travis Walker, Co-Founder</p>

							<Divider type="vertical" />

							<p className="text-sm font-semibold text-theme-neutral">2 days ago</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-end">
					<Label color="warning">#Technical</Label>
				</div>
			</div>

			<Divider />

			<p>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio, voluptate! Rem molestiae mollitia error
				quidem nostrum saepe explicabo quas velit ipsum facere, excepturi iste. Minus dolore alias modi
				recusandae ab.
			</p>
		</div>
	</Card>
);
