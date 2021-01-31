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
import GetCookie from './GetCookie';

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
        this.deleteEntry = this.deleteEntry.bind(this);
        this.incrementQty = this.incrementQty.bind(this);
        this.decrementQty = this.decrementQty.bind(this);
        this.updateListCookie = this.updateListCookie.bind(this);
    }

    componentDidMount() { // Load list from cookie if present
        const cookie_shopping_list_str = GetCookie('shopping_list');
        if (cookie_shopping_list_str !== '') {
            const shopping_list = JSON.parse(cookie_shopping_list_str);
            this.setState({list_contents:shopping_list});
        } else {
            console.log('No shopping_list cookie present');
        }
    }

    updateListCookie() {
        let oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // set cookie to expire one year from now
        document.cookie = "shopping_list=" + JSON.stringify(this.state.list_contents) + "; expires=" + oneYearFromNow;
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

        let current_list = this.state.list_contents;

        let list_items_only = [];
        for (let i = 0; i < current_list.length; i++) {
            const current_list_entry = current_list[i];
            list_items_only.push(current_list_entry['item'])
        }

        if (entry.item !== '' && entry.quantity > 0 && !list_items_only.includes(entry.item)) {
            
            current_list.push(entry);

            this.setState({
                item: '',
                quantity: 1,
                list_contents: current_list,
                item_error: false,
                item_error_text: '',
                qty_error: false,
                qty_error_text: '',
            });
            this.updateListCookie()
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

    deleteEntry(list_entry) {
        let current_items_list = this.state.list_contents; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to remove
        if (index !== -1) { // In case index came up as not present
            current_items_list.splice(index, 1); // remove from the list
        }

        this.setState({
            list_contents: current_items_list
        });
        this.updateListCookie()
    }

    incrementQty(list_entry) {
        let current_items_list = this.state.list_contents; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to adjust
        if (index !== -1) {
            current_items_list[index].quantity += 1 // increase item qty by 1
        }

        this.setState({
            list_contents: current_items_list
        })
        this.updateListCookie()
    }

    decrementQty(list_entry) {
        let current_items_list = this.state.list_contents; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to adjust
        if (index !== -1) {
            if (current_items_list[index].quantity > 1) {
                current_items_list[index].quantity -= 1 // decrease item qty by 1
            }
        }

        this.setState({
            list_contents: current_items_list
        })
        this.updateListCookie()
    }

    render() {
        return (
            <div id="shopping-list-container">
            <h1>Shopping List</h1>
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
                            <TableCell id={"id_item_" + list_entry['item']}>{list_entry['item']}</TableCell>
                            <TableCell>{list_entry['quantity']}</TableCell>
                            <TableCell>
                                <IconButton onClick={()=>this.incrementQty(list_entry)}><UpIcon></UpIcon></IconButton>
                                <IconButton onClick={()=>this.decrementQty(list_entry)}><DownIcon></DownIcon></IconButton>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <IconButton onClick={()=>this.deleteEntry(list_entry)}><DeleteIcon></DeleteIcon></IconButton>
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