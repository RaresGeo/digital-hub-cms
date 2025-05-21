import { apiService as api } from 'src/store/apiService';
import { PartialDeep } from 'type-fest';
import ProductModel from './products/models/ProductModel';

export const addTagTypes = [
	'weddingInvitations_products',
	'weddingInvitations_product',
	'weddingInvitations_orders',
	'weddingInvitations_order'
] as const;

const WeddingInvitationsApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getWeddingInvitationsProducts: build.query<
				GetWeddingInvitationsProductsApiResponse,
				GetWeddingInvitationsProductsApiArg
			>({
				query: () => ({ url: `/api/mock/ecommerce/products` }),
				providesTags: ['weddingInvitations_products']
			}),
			deleteWeddingInvitationsProducts: build.mutation<
				DeleteWeddingInvitationsProductsApiResponse,
				DeleteWeddingInvitationsProductsApiArg
			>({
				query: (productIds) => ({
					url: `/api/mock/ecommerce/products`,
					method: 'DELETE',
					body: productIds
				}),
				invalidatesTags: ['weddingInvitations_products']
			}),
			getWeddingInvitationsProduct: build.query<
				GetWeddingInvitationsProductApiResponse,
				GetWeddingInvitationsProductApiArg
			>({
				query: (productId) => ({
					url: `/api/mock/ecommerce/products/${productId}`
				}),
				providesTags: ['weddingInvitations_product', 'weddingInvitations_products']
			}),
			createWeddingInvitationsProduct: build.mutation<
				CreateWeddingInvitationsProductApiResponse,
				CreateWeddingInvitationsProductApiArg
			>({
				query: (newProduct) => ({
					url: `/api/mock/ecommerce/products`,
					method: 'POST',
					body: ProductModel(newProduct)
				}),
				invalidatesTags: ['weddingInvitations_products', 'weddingInvitations_product']
			}),
			updateWeddingInvitationsProduct: build.mutation<
				UpdateWeddingInvitationsProductApiResponse,
				UpdateWeddingInvitationsProductApiArg
			>({
				query: (product) => ({
					url: `/api/mock/ecommerce/products/${product.id}`,
					method: 'PUT',
					body: product
				}),
				invalidatesTags: ['weddingInvitations_product', 'weddingInvitations_products']
			}),
			deleteWeddingInvitationsProduct: build.mutation<
				DeleteWeddingInvitationsProductApiResponse,
				DeleteWeddingInvitationsProductApiArg
			>({
				query: (productId) => ({
					url: `/api/mock/ecommerce/products/${productId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['weddingInvitations_product', 'weddingInvitations_products']
			}),
			getWeddingInvitationsOrders: build.query<
				GetWeddingInvitationsOrdersApiResponse,
				GetWeddingInvitationsOrdersApiArg
			>({
				query: () => ({ url: `/api/mock/ecommerce/orders` }),
				providesTags: ['weddingInvitations_orders']
			}),
			getWeddingInvitationsOrder: build.query<
				GetWeddingInvitationsOrderApiResponse,
				GetWeddingInvitationsOrderApiArg
			>({
				query: (orderId) => ({ url: `/api/mock/ecommerce/orders/${orderId}` }),
				providesTags: ['weddingInvitations_order']
			}),
			updateWeddingInvitationsOrder: build.mutation<
				UpdateWeddingInvitationsOrderApiResponse,
				UpdateWeddingInvitationsOrderApiArg
			>({
				query: (order) => ({
					url: `/api/mock/ecommerce/orders/${order.id}`,
					method: 'PUT',
					body: order
				}),
				invalidatesTags: ['weddingInvitations_order', 'weddingInvitations_orders']
			}),
			deleteWeddingInvitationsOrder: build.mutation<
				DeleteWeddingInvitationsOrderApiResponse,
				DeleteWeddingInvitationsOrderApiArg
			>({
				query: (orderId) => ({
					url: `/api/mock/ecommerce/orders/${orderId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['weddingInvitations_order', 'weddingInvitations_orders']
			}),
			deleteWeddingInvitationsOrders: build.mutation<
				DeleteWeddingInvitationsOrdersApiResponse,
				DeleteWeddingInvitationsOrdersApiArg
			>({
				query: (ordersId) => ({
					url: `/api/mock/ecommerce/orders`,
					method: 'DELETE',
					body: ordersId
				}),
				invalidatesTags: ['weddingInvitations_order', 'weddingInvitations_orders']
			})
		}),
		overrideExisting: false
	});

export default WeddingInvitationsApi;

export type GetWeddingInvitationsProductsApiResponse = /** status 200 OK */ EcommerceProduct[];
export type GetWeddingInvitationsProductsApiArg = void;

export type DeleteWeddingInvitationsProductsApiResponse = unknown;
export type DeleteWeddingInvitationsProductsApiArg = string[]; /** Product ids */

export type GetWeddingInvitationsProductApiResponse = /** status 200 OK */ EcommerceProduct;
export type GetWeddingInvitationsProductApiArg = string;

export type CreateWeddingInvitationsProductApiResponse = /** status 200 OK */ EcommerceProduct;
export type CreateWeddingInvitationsProductApiArg = PartialDeep<EcommerceProduct>;

export type UpdateWeddingInvitationsProductApiResponse = unknown;
export type UpdateWeddingInvitationsProductApiArg = EcommerceProduct; // Product

export type DeleteWeddingInvitationsProductApiResponse = unknown;
export type DeleteWeddingInvitationsProductApiArg = string; // Product id

export type GetWeddingInvitationsOrdersApiResponse = /** status 200 OK */ EcommerceOrder[];
export type GetWeddingInvitationsOrdersApiArg = void;

export type GetWeddingInvitationsOrderApiResponse = /** status 200 OK */ EcommerceOrder;
export type GetWeddingInvitationsOrderApiArg = string; // Order id

export type UpdateWeddingInvitationsOrderApiResponse = EcommerceOrder;
export type UpdateWeddingInvitationsOrderApiArg = EcommerceOrder; // Order

export type DeleteWeddingInvitationsOrderApiResponse = unknown;
export type DeleteWeddingInvitationsOrderApiArg = string; // Order id

export type DeleteWeddingInvitationsOrdersApiResponse = unknown;
export type DeleteWeddingInvitationsOrdersApiArg = string[]; // Orders id

export type EcommerceProductImageType = {
	id: string;
	url: string;
	type: string;
};

export type EcommerceProduct = {
	id: string;
	name: string;
	handle: string;
	description: string;
	categories: string[];
	tags: string[];
	featuredImageId: string;
	images: EcommerceProductImageType[];
	priceTaxExcl: number;
	priceTaxIncl: number;
	taxRate: number;
	comparedPrice: number;
	quantity: number;
	sku: string;
	width: string;
	height: string;
	depth: string;
	weight: string;
	extraShippingFee: number;
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
	products: Partial<EcommerceProduct & { image: string; price: string }>[];
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
	useGetWeddingInvitationsProductsQuery,
	useDeleteWeddingInvitationsProductsMutation,
	useGetWeddingInvitationsProductQuery,
	useUpdateWeddingInvitationsProductMutation,
	useDeleteWeddingInvitationsProductMutation,
	useGetWeddingInvitationsOrdersQuery,
	useGetWeddingInvitationsOrderQuery,
	useUpdateWeddingInvitationsOrderMutation,
	useDeleteWeddingInvitationsOrderMutation,
	useDeleteWeddingInvitationsOrdersMutation,
	useCreateWeddingInvitationsProductMutation
} = WeddingInvitationsApi;

export type WeddingInvitationsApiType = {
	[WeddingInvitationsApi.reducerPath]: ReturnType<typeof WeddingInvitationsApi.reducer>;
};
