import GlobalStyles from '@mui/material/GlobalStyles';
import ReviewsHeader from './ReviewsHeader';
import ReviewsTable from './ReviewsTable';

/**
 * The reviews page.
 */
function Reviews() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full flex flex-col px-4">
				<ReviewsHeader />
				<ReviewsTable />
			</div>
		</>
	);
}

export default Reviews;
