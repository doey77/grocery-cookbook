import React from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import Paper from '@material-ui/core/Paper';

// Table stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { IconButton } from '@material-ui/core';

class ShoppingListForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            quantity: 1,
            list_contents: [],

            item_error_text: '',
            item_error: false,

            qty_error_text: '',
            qty_error: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            item_error_text: '',
            item_error: false,
            qty_error_text: '',
            qty_error: false,
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const entry = {
            item: this.state.item,
            quantity: parseInt(this.state.quantity, 10),
        };

        const current_list = this.state.list_contents;

        let list_items_only = [];
        for (let i = 0; i < current_list.length; i++) {
            const current_list_entry = current_list[i];
            list_items_only.push(current_list_entry['item'])
        }

        if (entry.item !== '' && entry.quantity > 0 && !list_items_only.includes(entry.item)) {
            
            this.state.list_contents.push(entry);
            this.setState({
                item: '',
                quantity: 1,
                item_error: false,
                item_error_text: '',
                qty_error: false,
                qty_error_text: '',
            });
        }
        
        if (entry.quantity > 0 && list_items_only.includes(entry.item)) {
            this.setState({
                item_error: true,
                item_error_text: 'That item already exists'
            })
        }
        if (entry.quantity <= 0) {
            this.setState({
                qty_error: true,
                qty_error_text: "Quantity must be > 0"
            })
        }
    }

    render() {
        return (
            <div id="shopping-list-container">
            <h3>Shopping List</h3>
            <form onSubmit={this.handleSubmit}>
                <TextField variant="standard" name="item" id="input_item" label="Item" 
                    onChange={this.handleChange} value={this.state.item}
                    helperText={this.state.item_error_text} error={this.state.item_error}
                />
                <TextField
                    variant="standard" name="quantity" label="Quantity" type="number"
                    style={{width:75}} onChange={this.handleChange}
                    value={this.state.quantity}
                    helperText={this.state.qty_error_text} error={this.state.qty_error}
                />
                <IconButton type="submit" aria-label="Add Item">
                    <AddIcon />
                </IconButton>
            </form>
            <br />
            <TableContainer component={Paper} style={{width:'fit-content', minWidth:300}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{minWidth:150}}>Item</TableCell>
                            <TableCell style={{maxWidth:50}}>Quantity</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.list_contents.map((list_entry) => (
                        <TableRow key={list_entry['item']}>
                            <TableCell>{list_entry['item']}</TableCell>
                            <TableCell>{list_entry['quantity']}&nbsp;</TableCell>
                            <TableCell>
                                <IconButton><UpIcon></UpIcon></IconButton>
                                <IconButton><DownIcon></DownIcon></IconButton>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <IconButton><DeleteIcon></DeleteIcon></IconButton>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        );
    }
}

function ShoppingList() {
    return (
        <ShoppingListForm></ShoppingListForm>
    );
}

export default ShoppingList;