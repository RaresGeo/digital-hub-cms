import { apiService as api } from "src/store/apiService";
import { PartialDeep } from "type-fest";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { ProductModelWithFormData } from "./products/models/ProductFormData";
import type {
	ProductListItem,
	ProductListResponse,
	ProductResponse,
	GetProductsQueryParams,
} from "src/api-schemas/products.schema";
import type {
	ReviewListResponse,
	ReviewStatsResponse,
	CreateReviewResponse,
	GetReviewsQueryParams,
	CreateReviewBody,
	UpdateReviewBody,
} from "src/api-schemas/reviews.schema";

export const addTagTypes = [
	"digitalPrintables_products",
	"digitalPrintables_product",
	"digitalPrintables_orders",
	"digitalPrintables_order",
	"digitalPrintables_reviews",
	"digitalPrintables_review",
	"digitalPrintables_reviewStats",
] as const;

const DigitalPrintablesApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getDigitalPrintablesProducts: build.query<
				GetDigitalPrintablesProductsApiResponse,
				GetDigitalPrintablesProductsApiArg
			>({
				query: (queryParams) => {
					const params = new URLSearchParams();

					params.append("productType", "DIGITAL_PRINTABLE");

					if (queryParams.cursor !== undefined)
						params.append("cursor", queryParams.cursor.toString());

					if (queryParams.limit !== undefined)
						params.append("limit", queryParams.limit.toString());

					if (queryParams.minPrice !== undefined)
						params.append("minPrice", queryParams.minPrice.toString());

					if (queryParams.maxPrice !== undefined)
						params.append("maxPrice", queryParams.maxPrice.toString());

					if (queryParams.tags !== undefined && queryParams.tags.length > 0) {
						params.append("tags", queryParams.tags.join(","));
					}

					if (queryParams.search !== undefined)
						params.append("search", queryParams.search);

					if (queryParams.titleSearch !== undefined)
						params.append("titleSearch", queryParams.titleSearch);

					if (queryParams.createdAfter !== undefined)
						params.append("createdAfter", queryParams.createdAfter.toString());

					if (queryParams.createdBefore !== undefined)
						params.append(
							"createdBefore",
							queryParams.createdBefore.toString(),
						);

					if (queryParams.updatedAfter !== undefined)
						params.append("updatedAfter", queryParams.updatedAfter.toString());

					if (queryParams.updatedBefore !== undefined)
						params.append(
							"updatedBefore",
							queryParams.updatedBefore.toString(),
						);

					if (queryParams.active !== undefined)
						params.append("active", queryParams.active.toString());

					if (queryParams.sortBy !== undefined)
						params.append("sortBy", queryParams.sortBy);

					if (queryParams.sortOrder !== undefined)
						params.append("sortOrder", queryParams.sortOrder);

					return {
						url: `/api/products/?${params.toString()}`,
					};
				},
				providesTags: ["digitalPrintables_products"],
			}),
			getDigitalPrintablesProduct: build.query<
				GetDigitalPrintablesProductApiResponse,
				GetDigitalPrintablesProductApiArg
			>({
				query: (productId) => ({
					url: `/api/products/${productId}`,
				}),
				providesTags: [
					"digitalPrintables_product",
					"digitalPrintables_products",
				],
			}),
			createDigitalPrintablesProduct: build.mutation<
				CreateDigitalPrintablesProductApiResponse,
				CreateDigitalPrintablesProductApiArg
			>({
				query: (newProduct) => ({
					url: `/api/products/`,
					method: "POST",
					body: ProductModelWithFormData(newProduct as DigitalPrintableProduct),
				}),
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: "Product Created Successfully" }));
					} catch (err) {
						console.error(err);
						dispatch(
							showMessage({
								message: "Error Creating Product!",
								variant: "error",
							}),
						);
					}
				},
				invalidatesTags: [
					"digitalPrintables_products",
					"digitalPrintables_product",
				],
			}),
			updateDigitalPrintablesProduct: build.mutation<
				UpdateDigitalPrintablesProductApiResponse,
				UpdateDigitalPrintablesProductApiArg
			>({
				query: (product) => ({
					url: `/api/products/`,
					method: "PUT",
					body: ProductModelWithFormData(product as DigitalPrintableProduct),
				}),
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: "Product Edited Successfully" }));
					} catch (err) {
						console.error(err);
						dispatch(
							showMessage({
								message: "Error Editing Product!",
								variant: "error",
							}),
						);
					}
				},
				invalidatesTags: [
					"digitalPrintables_product",
					"digitalPrintables_products",
				],
			}),
			deleteDigitalPrintablesProduct: build.mutation<
				DeleteDigitalPrintablesProductApiResponse,
				DeleteDigitalPrintablesProductApiArg
			>({
				query: (productId) => ({
					url: `/api/mock/ecommerce/products/${productId}`,
					method: "DELETE",
				}),
				invalidatesTags: [
					"digitalPrintables_product",
					"digitalPrintables_products",
				],
			}),
			getDigitalPrintablesOrders: build.query<
				GetDigitalPrintablesOrdersApiResponse,
				GetDigitalPrintablesOrdersApiArg
			>({
				query: () => ({ url: `/api/mock/ecommerce/orders` }),
				providesTags: ["digitalPrintables_orders"],
			}),
			getDigitalPrintablesOrder: build.query<
				GetDigitalPrintablesOrderApiResponse,
				GetDigitalPrintablesOrderApiArg
			>({
				query: (orderId) => ({ url: `/api/mock/ecommerce/orders/${orderId}` }),
				providesTags: ["digitalPrintables_order"],
			}),
			updateDigitalPrintablesOrder: build.mutation<
				UpdateDigitalPrintablesOrderApiResponse,
				UpdateDigitalPrintablesOrderApiArg
			>({
				query: (order) => ({
					url: `/api/mock/ecommerce/orders/${order.id}`,
					method: "PUT",
					body: order,
				}),
				invalidatesTags: [
					"digitalPrintables_order",
					"digitalPrintables_orders",
				],
			}),
			deleteDigitalPrintablesOrder: build.mutation<
				DeleteDigitalPrintablesOrderApiResponse,
				DeleteDigitalPrintablesOrderApiArg
			>({
				query: (orderId) => ({
					url: `/api/mock/ecommerce/orders/${orderId}`,
					method: "DELETE",
				}),
				invalidatesTags: [
					"digitalPrintables_order",
					"digitalPrintables_orders",
				],
			}),
			deleteDigitalPrintablesOrders: build.mutation<
				DeleteDigitalPrintablesOrdersApiResponse,
				DeleteDigitalPrintablesOrdersApiArg
			>({
				query: (ordersId) => ({
					url: `/api/mock/ecommerce/orders`,
					method: "DELETE",
					body: ordersId,
				}),
				invalidatesTags: [
					"digitalPrintables_order",
					"digitalPrintables_orders",
				],
			}),
			// Review endpoints
			getDigitalPrintablesReviews: build.query<
				GetDigitalPrintablesReviewsApiResponse,
				GetDigitalPrintablesReviewsApiArg
			>({
				query: ({ productId, ...queryParams }) => {
					const params = new URLSearchParams();

					if (queryParams.cursor !== undefined)
						params.append("cursor", queryParams.cursor.toString());

					if (queryParams.limit !== undefined)
						params.append("limit", queryParams.limit.toString());

					if (queryParams.sortBy !== undefined)
						params.append("sortBy", queryParams.sortBy);

					if (queryParams.sortOrder !== undefined)
						params.append("sortOrder", queryParams.sortOrder);

					return {
						url: `/api/products/${productId}/reviews?${params.toString()}`,
					};
				},
				providesTags: ["digitalPrintables_reviews"],
			}),
			getDigitalPrintablesReviewStats: build.query<
				GetDigitalPrintablesReviewStatsApiResponse,
				GetDigitalPrintablesReviewStatsApiArg
			>({
				query: (productId) => ({
					url: `/api/products/${productId}/reviews/stats`,
				}),
				providesTags: ["digitalPrintables_reviewStats"],
			}),
			createDigitalPrintablesReview: build.mutation<
				CreateDigitalPrintablesReviewApiResponse,
				CreateDigitalPrintablesReviewApiArg
			>({
				query: ({ productId, ...body }) => ({
					url: `/api/products/${productId}/reviews`,
					method: "POST",
					body,
				}),
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: "Review Created Successfully" }));
					} catch (err) {
						console.error(err);
						dispatch(
							showMessage({
								message: "Error Creating Review!",
								variant: "error",
							}),
						);
					}
				},
				invalidatesTags: [
					"digitalPrintables_reviews",
					"digitalPrintables_reviewStats",
				],
			}),
			updateDigitalPrintablesReview: build.mutation<
				UpdateDigitalPrintablesReviewApiResponse,
				UpdateDigitalPrintablesReviewApiArg
			>({
				query: ({ reviewId, ...body }) => ({
					url: `/api/reviews/${reviewId}`,
					method: "PUT",
					body,
				}),
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: "Review Updated Successfully" }));
					} catch (err) {
						console.error(err);
						dispatch(
							showMessage({
								message: "Error Updating Review!",
								variant: "error",
							}),
						);
					}
				},
				invalidatesTags: [
					"digitalPrintables_review",
					"digitalPrintables_reviews",
					"digitalPrintables_reviewStats",
				],
			}),
			deleteDigitalPrintablesReview: build.mutation<
				DeleteDigitalPrintablesReviewApiResponse,
				DeleteDigitalPrintablesReviewApiArg
			>({
				query: (reviewId) => ({
					url: `/api/reviews/${reviewId}`,
					method: "DELETE",
				}),
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(showMessage({ message: "Review Deleted Successfully" }));
					} catch (err) {
						console.error(err);
						dispatch(
							showMessage({
								message: "Error Deleting Review!",
								variant: "error",
							}),
						);
					}
				},
				invalidatesTags: [
					"digitalPrintables_reviews",
					"digitalPrintables_reviewStats",
				],
			}),
		}),
		overrideExisting: false,
	});

export default DigitalPrintablesApi;

// Use backend schema types with CMS-specific additions
export type DigitalPrintableListItem = ProductListItem & {
	draft?: boolean; // CMS-specific field (not from backend)
};

export type GetDigitalPrintablesProductsApiResponse = ProductListResponse;

export type GetDigitalPrintablesProductsApiArg = GetProductsQueryParams & {
	isAdmin?: boolean; // CMS-specific field (not from backend)
};

export type DeleteDigitalPrintablesProductsApiResponse = unknown;
export type DeleteDigitalPrintablesProductsApiArg = string[]; /** Product ids */

export type GetDigitalPrintablesProductApiResponse = ProductResponse;
export type GetDigitalPrintablesProductApiArg = string;

// Extract the product type from the response for convenience
export type DigitalPrintableProduct = ProductResponse['product'];

export type CreateDigitalPrintablesProductApiResponse = /** status 200 OK */ {
	productId: string;
};
export type CreateDigitalPrintablesProductApiArg =
	PartialDeep<DigitalPrintableProduct>;

export type UpdateDigitalPrintablesProductApiResponse = unknown;
export type UpdateDigitalPrintablesProductApiArg = DigitalPrintableProduct; // Product

export type DeleteDigitalPrintablesProductApiResponse = unknown;
export type DeleteDigitalPrintablesProductApiArg = string; // Product id

export type GetDigitalPrintablesOrdersApiResponse =
  /** status 200 OK */ EcommerceOrder[];
export type GetDigitalPrintablesOrdersApiArg = void;

export type GetDigitalPrintablesOrderApiResponse =
  /** status 200 OK */ EcommerceOrder;
export type GetDigitalPrintablesOrderApiArg = string; // Order id

export type UpdateDigitalPrintablesOrderApiResponse = EcommerceOrder;
export type UpdateDigitalPrintablesOrderApiArg = EcommerceOrder; // Order

export type DeleteDigitalPrintablesOrderApiResponse = unknown;
export type DeleteDigitalPrintablesOrderApiArg = string; // Order id

export type DeleteDigitalPrintablesOrdersApiResponse = unknown;
export type DeleteDigitalPrintablesOrdersApiArg = string[]; // Orders id

// Extract nested types from backend ProductResponse for convenience
export type DigitalPrintableVariantPhoto = ProductResponse['product']['variants'][number]['photos'][number];
export type DigitalPrintableProductVariant = ProductResponse['product']['variants'][number];

// CMS-specific variant asset type that extends backend type with File for uploads
export type DigitalPrintableVariantAsset = NonNullable<ProductResponse['product']['variants'][number]['digitalAsset']> & {
	file?: File | null; // CMS-specific field for file uploads
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
	products: Partial<
		DigitalPrintableProduct & { image: string; price: string }
	>[];
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

// Review types from backend schemas
export type DigitalPrintableReviewListItem = ReviewListResponse['reviews'][number];
export type GetDigitalPrintablesReviewsApiResponse = ReviewListResponse;
export type GetDigitalPrintablesReviewsApiArg = GetReviewsQueryParams & {
	productId: string;
};
export type GetDigitalPrintablesReviewStatsApiResponse = ReviewStatsResponse;
export type GetDigitalPrintablesReviewStatsApiArg = string; // productId
export type CreateDigitalPrintablesReviewApiResponse = CreateReviewResponse;
export type CreateDigitalPrintablesReviewApiArg = CreateReviewBody & {
	productId: string;
};
export type UpdateDigitalPrintablesReviewApiResponse = unknown;
export type UpdateDigitalPrintablesReviewApiArg = UpdateReviewBody & {
	reviewId: string;
};
export type DeleteDigitalPrintablesReviewApiResponse = unknown;
export type DeleteDigitalPrintablesReviewApiArg = string; // reviewId

export const {
	useGetDigitalPrintablesProductsQuery,
	useGetDigitalPrintablesProductQuery,
	useUpdateDigitalPrintablesProductMutation,
	useDeleteDigitalPrintablesProductMutation,
	useCreateDigitalPrintablesProductMutation,
	useGetDigitalPrintablesOrdersQuery,
	useGetDigitalPrintablesOrderQuery,
	useUpdateDigitalPrintablesOrderMutation,
	useDeleteDigitalPrintablesOrderMutation,
	useDeleteDigitalPrintablesOrdersMutation,
	useGetDigitalPrintablesReviewsQuery,
	useGetDigitalPrintablesReviewStatsQuery,
	useCreateDigitalPrintablesReviewMutation,
	useUpdateDigitalPrintablesReviewMutation,
	useDeleteDigitalPrintablesReviewMutation,
} = DigitalPrintablesApi;

export type DigitalPrintableDigitalPrintables = {
	[DigitalPrintablesApi.reducerPath]: ReturnType<
		typeof DigitalPrintablesApi.reducer
	>;
};
