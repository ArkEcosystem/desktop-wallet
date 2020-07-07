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
				<div className="flex items-center space-x-4">
					<Circle className="text-theme-danger-400 border-theme-danger-200" size="lg">
						<Icon name="Ark" width={20} height={20} />
					</Circle>

					<div>
						<p className="text-lg font-semibold">ARK Ecosystem</p>

						<div className="flex items-center space-x-4">
							<p className="text-sm font-semibold text-theme-neutral">Travis Walker, Co-Founder</p>
							<Divider type="vertical" />
							<p className="text-sm font-semibold text-theme-neutral">2 days ago</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-end">
					<Label color="warning">
						<span className="text-sm">#Technical</span>
					</Label>
				</div>
			</div>

			<Divider />

			<p className="text-theme-neutral-dark">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio, voluptate! Rem molestiae mollitia error
				quidem nostrum saepe explicabo quas velit ipsum facere, excepturi iste. Minus dolore alias modi
				recusandae ab.
			</p>

			<div className="flex justify-center p-1 -mx-10 border-t-2 border-theme-primary-contrast">
				<img src="https://miro.medium.com/max/1000/1*vMM0Z7qfGgA8a8NRhB_ZQA.png" alt="ARK Banner" />
			</div>
		</div>
	</Card>
);
