import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { SelectNetwork } from "app/components/SelectNetwork";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
	selectedAssets?: any[];
	allAssets?: any[];
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onUpdate?: any;
};

export const AddAssets = ({ selectedAssets, allAssets, isOpen, onClose, onCancel, onUpdate }: Props) => {
	const form = useForm({ mode: "onChange" });

	const { t } = useTranslation();

	return (
		<Modal
			title={t("NEWS.ADD_ASSETS.TITLE")}
			description={t("NEWS.ADD_ASSETS.DESCRIPTION")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Form context={form} onSubmit={onUpdate}>
				<FormField name="network" className="mt-8">
					<FormLabel>{t("COMMON.CRYPTOASSET")}</FormLabel>
					<SelectNetwork networks={[]} placeholder={t("NEWS.ADD_ASSETS.PLACEHOLDER")} />
					<FormHelperText />
				</FormField>

				<div className="flex flex-col space-y-10">
					<div>
						<span className="font-semibold text-theme-neutral-dark">{t("NEWS.ADD_ASSETS.SELECTIONS")}</span>
						<div className="mt-3">
							<FilterNetwork networks={selectedAssets} hideViewAll />
						</div>
					</div>

					<div>
						<span className="mb-3 font-semibold text-theme-neutral-dark">
							{t("NEWS.ADD_ASSETS.ALL_ASSETS")}
						</span>
						<div className="flex flex-wrap mt-3 -mx-3">
							{allAssets?.map((asset, index) => (
								<Circle
									key={index}
									size="lg"
									className="relative m-3 border-theme-neutral-200 text-theme-neutral-300"
								>
									<Icon name="Ark" width={20} height={20} />
									<Badge className="border-theme-neutral-200" />
								</Circle>
							))}

							<Circle size="lg" className="relative m-3 border-theme-neutral-200 text-theme-neutral-300">
								<div className="text-xs text-theme-primary-500">+443</div>
							</Circle>
						</div>
					</div>
				</div>

				<div className="flex justify-end mt-4 space-x-3">
					<Button variant="plain">{t("COMMON.CANCEL")}</Button>
					<Button type="submit">{t("COMMON.UPDATE")}</Button>
				</div>
			</Form>
		</Modal>
	);
};

AddAssets.defaultProps = {
	isOpen: false,
};
