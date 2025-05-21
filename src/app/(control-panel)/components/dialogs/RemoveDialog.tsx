import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';



function ConfirmRemoveDialog({ onCancel, onRemove }) {
	return (
		<React.Fragment>
			<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
			<DialogContent className="space-y-1.5">
				<DialogContentText id="alert-dialog-description">
					This item will not be fully removed until the changes are submitted.
				</DialogContentText>
				<DialogContentText id="alert-dialog-description">
					If you wish to bring back the deleted item, reload the page without saving. Do note this will also
					remove any changes made to this product
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onCancel}
					color="primary"
				>
					Cancel
				</Button>
				<Button
					onClick={onRemove}
					color="error"
					variant="contained"
					autoFocus
				>
					Remove
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}

export default ConfirmRemoveDialog;