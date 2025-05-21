/**
 * Transforms React Hook Form data into FormData for API submission with RTK Query
 */

import { DigitalPrintableProduct } from '../../DigitalPrintablesApi';
import { ProductModel } from './ProductModel';

// This function can be used in your API slice to transform the payload before sending
export const prepareFormDataForApi = (payload: DigitalPrintableProduct) => {
	const formData = new FormData();

	const productData = {
		id: payload.id,
		type: 'DIGITAL_PRINTABLE',
		title: payload.title,
		description: payload.description,
		active: (payload.active ?? true).toString(),
		featuredImageId: payload.featuredImageId,
		tags: payload.tags,
		variants: payload.variants.map((variant) => ({
			id: variant.id,
			title: variant.title,
			price: variant.price,
			sortOrder: variant.sortOrder,
			active: variant.active,
			photos: variant.photos.map((photo) => ({
				id: photo.id,
				sortOrder: photo.sortOrder
			})),
			digitalAsset: {
				filename: variant.digitalAsset.name,
				size: variant.digitalAsset.size
			}
			// metadata: variant.metadata
		}))
	};

	// Add basic product data

	// Handle variants
	if (payload.variants && payload.variants.length > 0) {
		payload.variants.forEach((variant) => {
			// Handle photos
			if (variant.photos && variant.photos.length > 0) {
				variant.photos.forEach((photo) => {
					// If the URL is a base64 string, convert to a file
					if (photo.url && photo.url.startsWith('data:')) {
						const file = base64ToFile(photo.url, `photo-${photo.id}`);
						formData.append(`variant_photo_${variant.id}_${photo.id}`, file);
					}
					// If not, this likely means that the photo is already uploaded
				});
			} else {
				throw new Error('At least one photo is required for each variant');
			}

			// Handle digital asset if available
			if (variant.digitalAsset && variant.digitalAsset.file) {
				// If it's a File object, append it directly
				if (variant.digitalAsset.file instanceof File) {
					formData.append(`variant_digital_asset_${variant.id}`, variant.digitalAsset.file);
				}
			}
		});
	} else {
		throw new Error('At least one variant is required');
	}

	formData.append('productData', JSON.stringify(productData));

	console.debug('~formData', JSON.stringify(productData, null, 2));

	return formData;
};

/**
 * Converts a base64 string to a File object
 */
const base64ToFile = (base64String: string, filename: string): File => {
	// Extract data URI parts
	const arr = base64String.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
	const bstr = atob(arr[1]);

	// Create array buffer
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	// Create File object
	return new File([u8arr], filename, { type: mime });
};

// Modified ProductModel to handle FormData
export const ProductModelWithFormData = (data: DigitalPrintableProduct) => {
	// Apply defaults first
	const productWithDefaults = ProductModel(data);

	// Then transform to FormData
	return prepareFormDataForApi(productWithDefaults as DigitalPrintableProduct);
};
