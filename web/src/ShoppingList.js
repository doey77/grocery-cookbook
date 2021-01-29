import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';

class ShoppingListForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            quantity: '1',
            list_contents: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const entry = {
            item: this.state.item,
            quantity: this.state.quantity,
        };
        this.state.list_contents.push(entry);


        const list_jsx = this.state.list_contents.map((list_entry) =>
            <p key={list_entry['item']}>{list_entry['item']} {list_entry['quantity']}</p>
        );
 
        ReactDOM.render(list_jsx, document.getElementById('shopping-list-contents'));

        this.setState({
            item: '',
            quantity: '1',
        })
    }

    render() {
        return (
            <div id="shopping-list-container">
            <form onSubmit={this.handleSubmit}>
                <TextField variant="standard" name="item" label="Item" onChange={this.handleChange}/>
                <TextField
                    variant="standard" name="quantity" defaultValue="1" label="Quantity" type="number"
                    style={{width:50}} inputProps={{min:"1"}} onChange={this.handleChange}
                />
                <IconButton type="submit" aria-label="Add Item">
                    <AddIcon />
                </IconButton>
            </form>
            <br />
            <div id="shopping-list-contents"></div>
            </div>
        );
    }
}

function ShoppingList() {
    return (
        <div id="shopping-list-master-container">
        <ShoppingListForm></ShoppingListForm>
        </div>
    );
}

export default ShoppingList;