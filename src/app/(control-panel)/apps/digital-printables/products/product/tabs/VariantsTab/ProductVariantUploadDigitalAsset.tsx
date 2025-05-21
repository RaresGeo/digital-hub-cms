import { lighten } from '@mui/material/styles';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { DigitalPrintableProductVariant } from '../../../../DigitalPrintablesApi';
import { Button } from '@mui/material';
import { useMemo } from 'react';

type ProductVariantTabProps = {
	variantId: string;
};

const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeIcon = (fileType) => {
	if (fileType.includes('pdf')) {
		return <span className="mr-1">📄 PDF • </span>;
	} else if (fileType.includes('zip') || fileType.includes('compressed')) {
		return <span className="mr-1">🗜️ ZIP • </span>;
	} else if (fileType.includes('image')) {
		return <span className="mr-1">🖼️ Image • </span>;
	} else {
		return <span className="mr-1">📁 File • </span>;
	}
};

function ProductVariantUploadDigitalAsset({ variantId }: ProductVariantTabProps) {
	const methods = useFormContext();
	const { control, watch } = methods;

	const variants = watch('variants') as DigitalPrintableProductVariant[];

	const variantIndex = useMemo(() => {
		return variants.findIndex((v) => v.id === variantId);
	}, [variants, variantId]);

	return (
		<div className="flex justify-center sm:justify-start flex-wrap -mx-3">
			<Controller
				name={`variants.${variantIndex}.digitalAsset`}
				control={control}
				render={({ field: { onChange, value } }) => (
					<>
						<Box
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.2)
								})
							})}
							component="label"
							htmlFor={`digital-asset-variant-${variantId}`}
							className={`flex flex-col items-center justify-center relative w-64 h-32 rounded-lg mx-3 mb-6 overflow-hidden cursor-pointer shadow-sm hover:shadow-lg ${value ? 'hidden' : ''}`}
						>
							<input
								// Accept all file types
								accept="*/*"
								className="hidden"
								id={`digital-asset-variant-${variantId}`}
								type="file"
								onChange={async (e) => {
									const file = e?.target?.files?.[0];

									if (!file) return;

									// Create an object with file details
									const assetInfo = {
										id: FuseUtils.generateGUID(),
										name: file.name,
										size: file.size,
										type: file.type,
										// Store the file object itself for later upload
										file: file
									};

									onChange(assetInfo);
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								heroicons-outline:document-add
							</FuseSvgIcon>
							<div className="mt-2 text-sm text-center">
								Upload Digital Asset
								<br />
								<span className="text-xs text-gray-500">(PDF, ZIP, etc.)</span>
							</div>
						</Box>

						{/* Display file info when a file is selected */}
						{value && (
							<Box
								sx={(theme) => ({
									backgroundColor: lighten(theme.palette.background.default, 0.02),
									...theme.applyStyles('light', {
										backgroundColor: lighten(theme.palette.background.default, 0.2)
									})
								})}
								className="flex flex-col relative w-64 h-32 rounded-lg mx-3 mb-6 p-3 shadow-sm"
							>
								<div className="flex justify-between items-start">
									<div className="flex-1 overflow-hidden">
										<div
											className="font-medium text-sm truncate"
											title={value.name}
										>
											{value.name}
										</div>
										<div className="text-xs text-gray-500 mt-1">
											{getFileTypeIcon(value.type)}
											{formatFileSize(value.size)}
										</div>
									</div>
									<button
										type="button"
										className="text-gray-500 hover:text-red-500"
										onClick={() => onChange(null)}
									>
										<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
									</button>
								</div>
								<div className="mt-auto flex justify-end">
									<Button
										className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
										onClick={() => {
											// Replace with a new file
											const fileInput = document.getElementById(
												`digital-asset-variant-${variantId}`
											);

											if (fileInput) fileInput.click();
										}}
									>
										Replace
									</Button>
								</div>
							</Box>
						)}
					</>
				)}
			/>
		</div>
	);
}

export default ProductVariantUploadDigitalAsset;
