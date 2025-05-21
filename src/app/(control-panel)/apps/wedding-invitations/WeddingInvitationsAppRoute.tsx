import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const WeddingInvitationsApp = lazy(() => import('./WeddingInvitationsApp'));
const Product = lazy(() => import('./products/product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./orders/order/Order'));
const Orders = lazy(() => import('./orders/Orders'));

/**
 * The wedding invitations Routes.
 */
const WeddingInvitationsAppRoute: FuseRouteItemType = {
	path: 'apps/wedding-invitations',
	element: <WeddingInvitationsApp />,
	children: [
		{
			path: '',
			element: <Navigate to="products" />
		},
		{
			path: 'products',
			children: [
				{
					path: '',
					element: <Products />
				},
				{
					path: ':productId/:handle?',
					element: <Product />
				}
			]
		},
		{
			path: 'orders',
			children: [
				{
					path: '',
					element: <Orders />
				},
				{
					path: ':orderId',
					element: <Order />
				}
			]
		}
	]
};

export default WeddingInvitationsAppRoute;
