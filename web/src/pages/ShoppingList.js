import React from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Pop-up dialog box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Select stuff
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

// Table stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Grid, IconButton } from '@material-ui/core';
import GetCookie from '../common-functions/GetCookie';

import '../css/ShoppingList.css';

class ShoppingListForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            quantity: 1,
            saved_lists: [{
                name: 'My List',
                content: [],
            }],
            current_list_index: 0,

            item_error_text: '',
            item_error: false,

            qty_error_text: '',
            qty_error: false,

            show_add_list: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.incrementQty = this.incrementQty.bind(this);
        this.decrementQty = this.decrementQty.bind(this);
        this.updateListCookie = this.updateListCookie.bind(this);
        this.toggleCreateList = this.toggleCreateList.bind(this);
        this.handleSubmitNewList = this.handleSubmitNewList.bind(this);
    }

    componentDidMount() { // Load list from cookie if present
        const cookie_saved_lists_str = GetCookie('saved_lists');
        const cookie_current_list_index = GetCookie('current_list_index');
        if (cookie_saved_lists_str !== '') {
            const saved_lists_cookie = JSON.parse(cookie_saved_lists_str);
            this.setState({saved_lists:saved_lists_cookie});
        } else {
            console.log('No saved_lists cookie present');
        }

        if (cookie_current_list_index !== '') {
            const current_list_index_cookie = JSON.parse(cookie_current_list_index)
            this.setState({current_list_index:current_list_index_cookie})
        } else {
            console.log('No current_list_index cookie present');
        }
    }

    updateListCookie() {
        const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // set cookie to expire one year from now
        document.cookie = "saved_lists=" + JSON.stringify(this.state.saved_lists) + "; expires=" + oneYearFromNow;
        document.cookie = "current_list_index=" + JSON.stringify(this.state.current_list_index);
    }

    handleChange(event) { // handle change for our add item form
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

    handleSelectChange(event) { //handle change for select list box
        this.setState({current_list_index: event.target.value})
    }

    handleSubmit(event) { //when submitting add item form
        event.preventDefault();
        const entry = {
            item: this.state.item,
            quantity: parseInt(this.state.quantity, 10),
        };

        const current_list_index = this.state.current_list_index;

        let current_list = this.state.saved_lists[current_list_index].content;

        let list_items_only = [];
        for (let i = 0; i < current_list.length; i++) {
            const current_list_entry = current_list[i];
            list_items_only.push(current_list_entry['item'])
        }

        if (entry.item !== '' && entry.quantity > 0 && !list_items_only.includes(entry.item)) {
            
            current_list.push(entry);

            let saved_lists_new = this.state.saved_lists;
            saved_lists_new[current_list_index].content = current_list;

            this.setState({
                item: '',
                quantity: 1,
                saved_lists: saved_lists_new,
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

    deleteEntry(list_entry) { // delete a submitted item
        let current_items_list = this.state.saved_lists[this.state.current_list_index].content; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to remove
        if (index !== -1) { // In case index came up as not present
            current_items_list.splice(index, 1); // remove from the list
        }

        let saved_lists_new = this.state.saved_lists
        saved_lists_new[this.state.current_list_index].content = current_items_list

        this.setState({
            saved_lists: saved_lists_new,
        });
        this.updateListCookie()
    }

    incrementQty(list_entry) {
        let current_items_list = this.state.saved_lists[this.state.current_list_index].content; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to adjust
        if (index !== -1) {
            current_items_list[index].quantity += 1 // increase item qty by 1
        }

        let saved_lists_new = this.state.saved_lists
        saved_lists_new[this.state.current_list_index].content = current_items_list

        this.setState({
            saved_lists: saved_lists_new,
        })
        this.updateListCookie()
    }

    decrementQty(list_entry) {
        let current_items_list = this.state.saved_lists[this.state.current_list_index].content; // get our current list
        let index = current_items_list.indexOf(list_entry); // get index of value to adjust
        if (index !== -1) {
            if (current_items_list[index].quantity > 1) {
                current_items_list[index].quantity -= 1 // decrease item qty by 1
            }
        }

        let saved_lists_new = this.state.saved_lists
        saved_lists_new[this.state.current_list_index].content = current_items_list

        this.setState({
            saved_lists: saved_lists_new,
        })
        this.updateListCookie()
    }

    toggleCreateList(event) {
        if (this.state.show_add_list === true) {
            this.setState({show_add_list:false})
        } else {
            this.setState({show_add_list:true})
        }
    }

    handleSubmitNewList(event) {
        event.preventDefault();

        console.log(event.target.value);

        const new_list = {
            name: 'submitted_name',
            content: []
        };

        let saved_lists_new = this.state.saved_lists;
        const new_list_index = saved_lists_new.push(new_list) - 1;
        console.log(new_list_index)
        this.setState({
            show_add_list: false,
            saved_lists: saved_lists_new,
            current_list_index: new_list_index,
        })
    }

    render() {
        return (
            <div id="shopping-list-container">
            <Grid container direction="row" alignItems="center">
                <Grid item>
                <h1>Shopping List</h1>
                </Grid>
                <Grid item style={{marginLeft:25}}>
                <br />
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-age-native-simple">Current List</InputLabel>
                    <Select
                    className="select-current-list"
                    value={this.state.current_list_index}
                    onChange={this.handleSelectChange}
                    label="Current List"
                    >
                    {this.state.saved_lists.map((saved_list, index) => (
                        <MenuItem key={index} value={index}>{saved_list.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
                <Grid item style={{marginTop:20,marginLeft:7}}>
                    <IconButton type="button" onClick={this.toggleCreateList}><AddIcon /></IconButton>
                </Grid>
            </Grid>

            <Dialog open={this.state.show_add_list} onClose={this.toggleCreateList} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New Shopping List</DialogTitle>
                <form>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="List Name"
                    type="text"
                    fullWidth
                />
                </DialogContent>
                <DialogActions>
                <Button type="button" onClick={this.toggleCreateList} color="primary">
                    Cancel
                </Button>
                <Button type="submit" onClick={this.handleSubmitNewList} color="primary">
                    Create
                </Button>
                </DialogActions>
                </form>
            </Dialog>

            <br />
            
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
                        {this.state.saved_lists[this.state.current_list_index].content.map((list_entry) => (
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