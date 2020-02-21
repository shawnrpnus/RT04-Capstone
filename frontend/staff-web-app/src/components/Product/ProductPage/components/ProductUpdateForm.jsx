import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

class ProductUpdateForm extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        // selectedValue: PropTypes.string.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            originalProduct: this.props.product,
            product: this.props.product,
            open: this.props.open
        }
    }

    onChange = ({ target: input }) => {
        const product = { ...this.state.product }
        product[input.name] = input.value
        this.setState({ product })
    }

    make = () => {
        return <TextField id="standard-basic" label="Standard" />
    }

    render() {
        const { product } = this.state
        const { errors, open, onClose } = this.props
        console.log(product)

        return (
            <Dialog onClose={onClose} open={open} fullWidth maxWidth={"sm"}>
                <DialogTitle>Update product </DialogTitle>

                <DialogContent>
                    <TextField
                        id="standard-full-width"
                        label="Label"
                        value={product.productName}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button autoFocus color="primary">
                        Cancel
                     </Button>
                    <Button color="primary">
                        Subscribe
                    </Button>
                </DialogActions>

            </Dialog >
        );
    }
}


export default ProductUpdateForm