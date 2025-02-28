import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useState } from 'react';

function OAuthSignIn() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleSignIn = () => {
		setIsLoading(true);
		window.location.href = '/api/auth/login?redirectTo=admin';
	};

	return (
		<div className="w-2/3">
			<div className="mt-8 flex items-center space-x-4">
				<Button
					variant="outlined"
					className="flex-auto"
					onClick={handleGoogleSignIn}
					disabled={isLoading}
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:google
					</FuseSvgIcon>
				</Button>
			</div>
		</div>
	);
}

export default OAuthSignIn;
