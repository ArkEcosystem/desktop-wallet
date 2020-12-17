import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";
import { openFile } from "utils/electron-utils";

type SelectProfileImageProps = {
	className?: string;
	value?: string;
	name?: string;
	showLabel?: boolean;
	onSelect: (raw: string) => void;
};

const UploadButtonWrapper = styled.div`
	.upload-button {
		&:not(:focus):hover:enabled {
			${tw`bg-theme-neutral-900 opacity-85`};

			.upload-button__icon {
				${tw`text-white`};
			}
		}
	}
`;

const ProfileImageStyled = styled.div`
	& {
		${tw`relative inline-flex items-center justify-center overflow-hidden rounded cursor-pointer`};
	}

	&:after {
		content: "";
		box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.4);
		${tw`absolute rounded-full w-22 h-22 left-1 top-1`};
	}

	&:hover .upload-button-overlay {
		${tw`block`};

		div {
			${tw`bg-theme-neutral-900 opacity-85`};
		}
	}
`;

export const SelectProfileImage = ({ className, value, name, showLabel, onSelect }: SelectProfileImageProps) => {
	const { t } = useTranslation();

	const handleUploadImage = async () => {
		const raw = await openFile(null, {
			filters: { name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] },
			encoding: "base64",
		});

		if (raw) {
			onSelect(`data:image/png;base64,${raw}`);
		}
	};

	const isSvg = useMemo(() => value?.endsWith("</svg>"), [value]);

	return (
		<div className={`group ${className}`}>
			{showLabel && (
				<span className="text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary text-theme-secondary-text">
					{t("SETTINGS.GENERAL.PERSONAL.PROFILE_IMAGE")}
				</span>
			)}

			<div className="flex flex-row mt-2">
				{!value ? (
					<Tooltip content={t("SETTINGS.GENERAL.PERSONAL.UPLOAD_AVATAR")}>
						<div className="flex justify-center items-center w-24 h-24 rounded border-2 border-dashed border-theme-primary-contrast">
							<div className="overflow-hidden rounded-full w-22 h-22">
								<UploadButtonWrapper>
									<Button
										className="upload-button w-22 h-22"
										variant="secondary"
										onClick={handleUploadImage}
										data-testid="SelectProfileImage__upload-button"
									>
										<Icon
											name="Upload"
											className="upload-button__icon text-theme-primary"
											width={24}
											height={18}
										/>
									</Button>
								</UploadButtonWrapper>
							</div>
						</div>
					</Tooltip>
				) : (
					<div className="relative w-24 h-24 rounded bg-theme-neutral-contrast">
						<Tooltip content={t("SETTINGS.GENERAL.PERSONAL.UPLOAD_AVATAR")}>
							<ProfileImageStyled>
								<img
									src={isSvg ? `data:image/svg+xml;utf8,${value}` : value}
									className="object-cover w-24 h-24 bg-center bg-no-repeat bg-cover rounded"
									alt="Profile avatar"
								/>
								{isSvg && (
									<span className="absolute text-2xl font-semibold text-theme-background">
										{name?.slice(0, 2).toUpperCase()}
									</span>
								)}

								<div
									className="hidden overflow-hidden absolute z-50 rounded-full upload-button-overlay w-22 h-22"
									onClick={handleUploadImage}
									data-testid="SelectProfileImage__upload-button"
								>
									<div className="flex justify-center items-center w-22 h-22">
										<Icon name="Upload" className="text-white" width={24} height={18} />
									</div>
								</div>
							</ProfileImageStyled>
						</Tooltip>
						{!isSvg && (
							<Tooltip content={t("SETTINGS.GENERAL.PERSONAL.DELETE_AVATAR")}>
								<Button
									size="icon"
									variant="danger"
									className="flex absolute -top-3 -right-3 justify-center items-center p-1 w-6 h-6"
									onClick={() => onSelect("")}
									data-testid="SelectProfileImage__remove-button"
								>
									<Icon name="Close" width={12} height={12} />
								</Button>
							</Tooltip>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

SelectProfileImage.defaultProps = {
	showLabel: true,
};
