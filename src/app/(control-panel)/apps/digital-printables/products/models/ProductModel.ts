import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import {
	DigitalPrintableProduct,
	DigitalPrintableProductVariant,
	DigitalPrintableVariantPhoto
} from '../../DigitalPrintablesApi';

/**
 * The product model.
 */
const ProductModel = (data: PartialDeep<DigitalPrintableProduct>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('new-product-'),
		title: '',
		description: '',
		tags: [],
		active: true,
		variants: [VariantModel({})]
	});

const VariantModel = (data: PartialDeep<DigitalPrintableProductVariant>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('new-variant-'),
		title: '',
		price: 0,
		active: true,
		sortOrder: 0,
		photos: []
	});

const VariantPhotoModel = (data: PartialDeep<DigitalPrintableVariantPhoto>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('new-photo-'),
		url: '',
		sortOrder: 0
	});

export { ProductModel, VariantModel, VariantPhotoModel };
