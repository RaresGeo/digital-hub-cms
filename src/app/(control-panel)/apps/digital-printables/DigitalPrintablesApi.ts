import { apiService as api } from 'src/store/apiService';
import { PartialDeep } from 'type-fest';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { ProductModelWithFormData } from './products/models/ProductFormData';

export const addTagTypes = [
	'digitalPrintables_products',
	'digitalPrintables_product',
	'digitalPrintables_orders',
	'digitalPrintables_order'
] as const;

const DigitalPrintablesApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getDigitalPrintablesProducts: build.query<
				GetDigitalPrintablesProductsApiResponse,
				GetDigitalPrintablesProductsApiArg
			>({
				query: (queryParams) => {
					const params = new URLSearchParams();

					params.append('productType', 'DIGITAL_PRINTABLE');

					if (queryParams.cursor !== undefined) params.append('cursor', queryParams.cursor.toString());

					if (queryParams.limit !== undefined) params.append('limit', queryParams.limit.toString());

					if (queryParams.minPrice !== undefined) params.append('minPrice', queryParams.minPrice.toString());

					if (queryParams.maxPrice !== undefined) params.append('maxPrice', queryParams.maxPrice.toString());

					if (queryParams.tags !== undefined && queryParams.tags.length > 0) {
						params.append('tags', queryParams.tags.join(','));
					}

					if (queryParams.search !== undefined) params.append('search', queryParams.search);

					if (queryParams.titleSearch !== undefined) params.append('titleSearch', queryParams.titleSearch);

					if (queryParams.createdAfter !== undefined)
						params.append('createdAfter', queryParams.createdAfter.toString());

					if (queryParams.createdBefore !== undefined)
						params.append('createdBefore', queryParams.createdBefore.toString());

					if (queryParams.updatedAfter !== undefined)
						params.append('updatedAfter', queryParams.updatedAfter.toString());

					if (queryParams.updatedBefore !== undefined)
						params.append('updatedBefore', queryParams.updatedBefore.toString());

					if (queryParams.active !== undefined) params.append('active', queryParams.active.toString());

					if (queryParams.sortBy !== undefined) params.append('sortBy', queryParams.sortBy);

					if (queryParams.sortOrder !== undefined) params.append('sortOrder', queryParams.sortOrder);

					return {
						url: `/api/products/?${params.toString()}`
					};
				},
				providesTags: ['digitalPrintables_products']
			}),
			getDigitalPrintablesProduct: build.query<
				GetDigitalPrintablesProductApiResponse,
				GetDigitalPrintablesProductApiArg
			>({
				query: (productId) => ({
					url: `/api/products/${productId}`
				}),
				providesTags: ['digitalPrintables_product', 'digitalPrintables_products']
			}),
			createDigitalPrintablesProduct: build.mutation<
				CreateDigitalPrintablesProductApiResponse,
				CreateDigitalPrintablesProductApiArg
			>({
				query: (newProduct) => ({
					url: `/api/products/`,
					method: 'POST',
					body: ProductModelWithFormData(newProduct as DigitalPrintableProduct)
				}),
				async onQueryStarted(id, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: 'Product Created Successfully' }));
					} catch (err) {
						console.error(err);
						dispatch(showMessage({ message: 'Error Creating Product!', variant: 'error' }));
					}
				},
				invalidatesTags: ['digitalPrintables_products', 'digitalPrintables_product']
			}),
			updateDigitalPrintablesProduct: build.mutation<
				UpdateDigitalPrintablesProductApiResponse,
				UpdateDigitalPrintablesProductApiArg
			>({
				query: (product) => ({
					url: `/api/mock/ecommerce/products/${product.id}`,
					method: 'PUT',
					body: product
				}),
				invalidatesTags: ['digitalPrintables_product', 'digitalPrintables_products']
			}),
			deleteDigitalPrintablesProduct: build.mutation<
				DeleteDigitalPrintablesProductApiResponse,
				DeleteDigitalPrintablesProductApiArg
			>({
				query: (productId) => ({
					url: `/api/mock/ecommerce/products/${productId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['digitalPrintables_product', 'digitalPrintables_products']
			}),
			getDigitalPrintablesOrders: build.query<
				GetDigitalPrintablesOrdersApiResponse,
				GetDigitalPrintablesOrdersApiArg
			>({
				query: () => ({ url: `/api/mock/ecommerce/orders` }),
				providesTags: ['digitalPrintables_orders']
			}),
			getDigitalPrintablesOrder: build.query<
				GetDigitalPrintablesOrderApiResponse,
				GetDigitalPrintablesOrderApiArg
			>({
				query: (orderId) => ({ url: `/api/mock/ecommerce/orders/${orderId}` }),
				providesTags: ['digitalPrintables_order']
			}),
			updateDigitalPrintablesOrder: build.mutation<
				UpdateDigitalPrintablesOrderApiResponse,
				UpdateDigitalPrintablesOrderApiArg
			>({
				query: (order) => ({
					url: `/api/mock/ecommerce/orders/${order.id}`,
					method: 'PUT',
					body: order
				}),
				invalidatesTags: ['digitalPrintables_order', 'digitalPrintables_orders']
			}),
			deleteDigitalPrintablesOrder: build.mutation<
				DeleteDigitalPrintablesOrderApiResponse,
				DeleteDigitalPrintablesOrderApiArg
			>({
				query: (orderId) => ({
					url: `/api/mock/ecommerce/orders/${orderId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['digitalPrintables_order', 'digitalPrintables_orders']
			}),
			deleteDigitalPrintablesOrders: build.mutation<
				DeleteDigitalPrintablesOrdersApiResponse,
				DeleteDigitalPrintablesOrdersApiArg
			>({
				query: (ordersId) => ({
					url: `/api/mock/ecommerce/orders`,
					method: 'DELETE',
					body: ordersId
				}),
				invalidatesTags: ['digitalPrintables_order', 'digitalPrintables_orders']
			})
		}),
		overrideExisting: false
	});

export default DigitalPrintablesApi;

export type DigitalPrintableListItem = {
	id: string;
	title: string;
	description: string;
	price: number;
	thumbnailUrl: string;
	tags: string[] | null;
	createdAt: Date;
	updatedAt: Date;
	active: boolean;
	draft: boolean;
};
export type GetDigitalPrintablesProductsApiResponse = /** status 200 OK */ {
	products: DigitalPrintableListItem[];
	nextCursor: number | null;
	totalCount: number;
};
export type GetDigitalPrintablesProductsApiArg = {
	productType?: 'DIGITAL_PRINTABLE';
	isAdmin?: boolean;
	cursor?: number;
	limit?: number;
	minPrice?: number;
	maxPrice?: number;
	tags?: string[];
	search?: string;
	titleSearch?: string;
	createdAfter?: Date;
	createdBefore?: Date;
	updatedAfter?: Date;
	updatedBefore?: Date;
	active?: boolean;
	sortBy: 'price' | 'createdAt' | 'updatedAt' | 'title' | 'active';
	sortOrder?: 'asc' | 'desc';
};

export type DeleteDigitalPrintablesProductsApiResponse = unknown;
export type DeleteDigitalPrintablesProductsApiArg = string[]; /** Product ids */

export type GetDigitalPrintablesProductApiResponse = /** status 200 OK */ { product: DigitalPrintableProduct };
export type GetDigitalPrintablesProductApiArg = string;

export type CreateDigitalPrintablesProductApiResponse = /** status 200 OK */ { productId: string };
export type CreateDigitalPrintablesProductApiArg = PartialDeep<DigitalPrintableProduct>;

export type UpdateDigitalPrintablesProductApiResponse = unknown;
export type UpdateDigitalPrintablesProductApiArg = DigitalPrintableProduct; // Product

export type DeleteDigitalPrintablesProductApiResponse = unknown;
export type DeleteDigitalPrintablesProductApiArg = string; // Product id

export type GetDigitalPrintablesOrdersApiResponse = /** status 200 OK */ EcommerceOrder[];
export type GetDigitalPrintablesOrdersApiArg = void;

export type GetDigitalPrintablesOrderApiResponse = /** status 200 OK */ EcommerceOrder;
export type GetDigitalPrintablesOrderApiArg = string; // Order id

export type UpdateDigitalPrintablesOrderApiResponse = EcommerceOrder;
export type UpdateDigitalPrintablesOrderApiArg = EcommerceOrder; // Order

export type DeleteDigitalPrintablesOrderApiResponse = unknown;
export type DeleteDigitalPrintablesOrderApiArg = string; // Order id

export type DeleteDigitalPrintablesOrdersApiResponse = unknown;
export type DeleteDigitalPrintablesOrdersApiArg = string[]; // Orders id

export type DigitalPrintableVariantPhoto = {
	id: string;
	url: string;
	sortOrder: number;
	featured: boolean;
};

export type DigitalPrintableVariantAsset = {
	file: File | null;
	url: string | null;
	name: string;
	type: string;
	size: number;
};

export type DigitalPrintableProductVariant = {
	id: string;
	title: string;
	price: number;
	digitalAsset: DigitalPrintableVariantAsset | null;
	active: boolean;
	sortOrder: number;
	photos: DigitalPrintableVariantPhoto[];
	// metadata: Record<string, any>;
};

export type DigitalPrintableProduct = {
	id: string;
	title: string;
	description: string;
	tags: string[];
	thumbnailUrl: string;
	featuredImageId: string;
	variants: DigitalPrintableProductVariant[];
	active: boolean;
};

export type EcommerceOrder = {
	id: string;
	reference: string;
	subtotal: string;
	tax: string;
	discount: string;
	total: string;
	date: string;
	customer: {
		id: string;
		firstName: string;
		lastName: string;
		avatar: string;
		company: string;
		jobTitle: string;
		email: string;
		phone: string;
		invoiceAddress: {
			address: string;
			lat: number;
			lng: number;
		};
		shippingAddress: {
			address: string;
			lat: number;
			lng: number;
		};
	};
	products: Partial<DigitalPrintableProduct & { image: string; price: string }>[];
	status: {
		id: string;
		name: string;
		color: string;
		date?: string;
	}[];
	payment: {
		transactionId: string;
		amount: string;
		method: string;
		date: string;
	};
	shippingDetails: {
		tracking: string;
		carrier: string;
		weight: string;
		fee: string;
		date: string;
	}[];
};

export const {
	useGetDigitalPrintablesProductsQuery,
	useGetDigitalPrintablesProductQuery,
	useUpdateDigitalPrintablesProductMutation,
	useDeleteDigitalPrintablesProductMutation,
	useGetDigitalPrintablesOrdersQuery,
	useGetDigitalPrintablesOrderQuery,
	useUpdateDigitalPrintablesOrderMutation,
	useDeleteDigitalPrintablesOrderMutation,
	useDeleteDigitalPrintablesOrdersMutation,
	useCreateDigitalPrintablesProductMutation
} = DigitalPrintablesApi;

export type DigitalPrintableDigitalPrintables = {
	[DigitalPrintablesApi.reducerPath]: ReturnType<typeof DigitalPrintablesApi.reducer>;
};
