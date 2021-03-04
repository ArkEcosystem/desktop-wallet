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
	${tw`h-full w-full`}

	button {
		${tw`h-full w-full`}

		&:not(:focus):hover:enabled {
			${tw`bg-theme-secondary-900 dark:bg-theme-secondary-600 opacity-85`};
		}
	}
`;

const ProfileImageStyled = styled.div`
	& {
		${tw`relative inline-flex items-center justify-center rounded-md overflow-hidden cursor-pointer h-full`};
	}

	&:after {
		content: "";
		box-shadow: 0 0 0 25px rgba(0, 0, 0, 0.4);
		${tw`absolute inset-1 rounded-full`};
	}

	&:hover .upload-button-overlay {
		${tw`block`};

		div {
			${tw`bg-theme-secondary-900 dark:bg-black opacity-85`};
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
		<div className={`group space-y-2 ${className}`}>
			{showLabel && (
				<span className="text-sm font-semibold transition-colors duration-100 cursor-default group-hover:text-theme-primary-600 text-theme-secondary-text">
					{t("SETTINGS.GENERAL.PERSONAL.PROFILE_IMAGE")}
				</span>
			)}

			<div className="flex flex-row">
				{value ? (
					<div className="relative w-20 h-20">
						<Tooltip content={t("SETTINGS.GENERAL.PERSONAL.UPLOAD_AVATAR")}>
							<ProfileImageStyled>
								<img
									data-testid="SelectProfileImage__avatar"
									src={isSvg ? `data:image/svg+xml;utf8,${value}` : value}
									className="object-cover min-h-full"
									alt="Avatar"
								/>
								{isSvg && (
									<span className="absolute text-2xl font-semibold text-theme-background">
										{name?.slice(0, 2).toUpperCase()}
									</span>
								)}

								<div
									className="hidden overflow-hidden absolute inset-1 z-50 rounded-full upload-button-overlay"
									onClick={handleUploadImage}
									data-testid="SelectProfileImage__upload-button"
								>
									<div className="flex justify-center items-center h-full">
										<Icon
											name="Upload"
											className="text-white dark:text-theme-secondary-200"
											width={24}
											height={18}
										/>
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
				) : (
					<Tooltip content={t("SETTINGS.GENERAL.PERSONAL.UPLOAD_AVATAR")}>
						<div className="p-1 w-20 h-20 rounded-md border-2 border-dashed border-theme-secondary-400 dark:border-theme-secondary-700">
							<div className="overflow-hidden h-full rounded-full">
								<UploadButtonWrapper>
									<Button
										variant="secondary"
										onClick={handleUploadImage}
										data-testid="SelectProfileImage__upload-button"
									>
										<Icon
											name="Upload"
											className="text-theme-primary-600 dark:text-theme-secondary-200"
											width={24}
											height={18}
										/>
									</Button>
								</UploadButtonWrapper>
							</div>
						</div>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

SelectProfileImage.defaultProps = {
	showLabel: true,
};
