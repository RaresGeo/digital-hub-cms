/**
 * Transforms React Hook Form data into FormData for API submission
 */
import { DigitalPrintableProduct } from "../../DigitalPrintablesApi";
import { ProductModel } from "./ProductModel";

const NEW_PRODUCT_PREFIX = "new-"; // Adjust this to match your actual prefix

/**
 * Converts a base64 string to a File object
 */
const base64ToFile = (base64String: string, filename: string): File => {
	const arr = base64String.split(",");
	const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};

/**
 * Transforms data for both product creation and editing
 */
export const prepareFormDataForApi = (payload: DigitalPrintableProduct) => {
	const formData = new FormData();
	const isCreating = !payload.id ||
		payload.id.startsWith(NEW_PRODUCT_PREFIX);

	console.log("~variants", payload.variants)
	payload.variants.forEach(variant => {
		console.log("~price is", variant.price, typeof variant.price)
		console.log("~parseInt is", parseInt(variant.price.toString()), typeof parseInt(variant.price.toString()))
		console.log("~parseInt \"\" is", parseInt(variant.price + ""))

	});

	const productData = {
		...(isCreating
			? { type: "DIGITAL_PRINTABLE" }
			: { id: payload.id }),
		title: payload.title,
		description: payload.description,
		active: payload.active ?? false,
		featuredImageId: payload.featuredImageId,
		tags: payload.tags,
		variants: payload.variants.map((variant) => ({
			id: variant.id,
			title: variant.title,
			price: parseInt(variant.price.toString()),
			sortOrder: variant.sortOrder,
			active: variant.active,
			photos: variant.photos.map((photo) => ({
				id: photo.id,
				sortOrder: photo.sortOrder,
			})),
			// Only include digitalAsset if it's new (being uploaded)
			...(variant.digitalAsset?.file &&
				variant.digitalAsset.file instanceof
				File
				? {
					digitalAsset: {
						filename:
							variant.digitalAsset
								.file.name,
						size: variant.digitalAsset.file
							.size,
					},
				}
				: {}),
		})),
	};

	// Handle variants
	if (!payload.variants || payload.variants.length === 0) {
		throw new Error("At least one variant is required");
	}

	payload.variants.forEach((variant) => {
		// Handle photos - only upload if photo ID starts with NEW_PRODUCT_PREFIX
		if (!variant.photos || variant.photos.length === 0) {
			throw new Error(
				"At least one photo is required for each variant",
			);
		}

		variant.photos.forEach((photo) => {
			if (photo.id.startsWith(NEW_PRODUCT_PREFIX)) {
				if (
					!photo.url ||
					!photo.url.startsWith("data:")
				) {
					throw new Error(
						"Missing base64 data for new photo",
					);
				}

				const file = base64ToFile(
					photo.url,
					`photo-${photo.id}`,
				);
				formData.append(
					`variant_photo_${variant.id}_${photo.id}`,
					file,
				);
				console.log(
					"~appended to ",
					`variant_photo_${variant.id}_${photo.id}`,
				);
			} else {
				console.log(photo.id);
			}
		});

		console.log(
			"~variant digital asset",
			variant.digitalAsset,
			!!variant.digitalAsset?.file,
			variant.digitalAsset.file instanceof File,
			variant.digitalAsset?.file &&
			variant.digitalAsset.file instanceof File,
		);

		// Handle digital asset - only upload if it's new
		if (
			variant.digitalAsset?.file &&
			variant.digitalAsset.file instanceof File
		) {
			console.log("~hello? why aren't we doing this?");
			formData.append(
				`variant_digital_asset_${variant.id}`,
				variant.digitalAsset.file,
			);
		} else if (
			variant.id.startsWith(NEW_PRODUCT_PREFIX) || isCreating
		) {
			// So if there isn't a digital asset file
			// But the variant is new

			throw new Error(
				"Missing digital asset for new variant",
			);
		}
	});

	formData.append("productData", JSON.stringify(productData));
	console.debug("~formData", JSON.stringify(productData, null, 2));
	return formData;
};

/**
 * Modified ProductModel to handle FormData
 */
export const ProductModelWithFormData = (data: DigitalPrintableProduct) => {
	const productWithDefaults = ProductModel(data);
	return prepareFormDataForApi(
		productWithDefaults as DigitalPrintableProduct,
	);
};
