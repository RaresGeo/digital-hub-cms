import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DigitalPrintablesApp = lazy(() => import('./DigitalPrintablesApp'));
const Product = lazy(() => import('./products/product/Product'));
const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./orders/order/Order'));
const Orders = lazy(() => import('./orders/Orders'));

/**
 * The digital printables Routes.
 */
const DigitalPrintablesAppRoute: FuseRouteItemType = {
	path: 'apps/digital-printables',
	element: <DigitalPrintablesApp />,
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
					path: ':productId?',
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

export default DigitalPrintablesAppRoute;
