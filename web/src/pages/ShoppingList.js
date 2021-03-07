import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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
import Menu from '@material-ui/core/Menu';

// Table stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Grid, IconButton } from '@material-ui/core';

import { useSnackbar } from 'notistack';

import { getCookie } from '../services/cookies';


import '../css/ShoppingList.css';


/**
 * Get the saved list cookie. If not found, returns an empty one
 * @returns Saved list from cookie, or an empty one
 */
function cookieSavedList() {
    const cookieSavedListsUnparsed = getCookie('saved_lists');

    if (cookieSavedListsUnparsed !== '') {
        return JSON.parse(cookieSavedListsUnparsed);
    } else {
        console.log('No saved_lists cookie present');
        return [{
            name: 'My List', content: [],
        }];
    }
}

/**
 * Get the current list index cookie. If not found, return 0 as index.
 * @returns Current list index from cookie, or 0
 */
function cookieCurrentListIndex() {
    const cookieCurrentListIndexUnparsed = getCookie('current_list_index');

    if (cookieCurrentListIndexUnparsed !== '') {
        console.log(JSON.parse(cookieCurrentListIndexUnparsed));
        return JSON.parse(cookieCurrentListIndexUnparsed);
    } else {
        console.log('No current_list_index cookie present');
        return 0;
    }  
}

function ShoppingList() {
    const wipeErrorTextField = {msg: '', err: false};

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [currentListIndex, setCurrentListIndex] = useState(cookieCurrentListIndex());
    const [savedLists, setSavedLists] = useState(cookieSavedList());

    const [newListName, setNewListName] = useState('');
    const [editListName, setEditListName] = useState('');

    const [addItemNameError, setAddItemNameError] = useState(wipeErrorTextField);
    const [addItemQtyError, setAddItemQtyError] = useState(wipeErrorTextField);
    const [newListNameError, setNewListNameError] = useState(wipeErrorTextField);
    const [editListNameError, setEditListNameError] = useState(wipeErrorTextField);

    const [showDialogNewList, setShowDialogNewList] = useState(false);
    const [showDialogEditList, setShowDialogEditList] = useState(false);

    const [menuListItemAnchorEl, setMenuListItemAnchorEl] = useState(null);


    const updateListCookie = () => {
        const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // set cookie to expire one year from now
        document.cookie = "saved_lists=" + JSON.stringify(savedLists) + "; path=/shoppinglist" + "; expires=" + oneYearFromNow;
        document.cookie = "current_list_index=" + JSON.stringify(currentListIndex) + "; path=/shoppinglist" + "; expires=" + oneYearFromNow;
    };

    const handleItemChange = event => {
        setItem(event.target.value);
        setAddItemNameError(wipeErrorTextField);
    };

    const handleQuantityChange = event => {
        setQuantity(event.target.value);
        setAddItemQtyError(wipeErrorTextField);
    };

    const handleNewListNameChange = event => {
        setNewListName(event.target.value);
        setNewListNameError(wipeErrorTextField);
    };

    const handleEditListNameChange = event => {
        setEditListName(event.target.value);
        setEditListNameError(wipeErrorTextField);
    };

    const submitItem = (event) => {
        event.preventDefault();
        const entry = {
            item: item,
            quantity: parseInt(quantity, 10),
        };

        const currentList = savedLists[currentListIndex].content;

        let listItems = [];
        for (let i = 0; i < currentList.length; i++) {
            listItems.push(currentList[i]['item']);
        }

        if (entry.item !== '' && entry.quantity > 0 && !listItems.includes(entry.item)) {
            // https://stackoverflow.com/questions/55856176/ui-not-re-rendering-on-state-update-using-react-hooks-and-form-submission
            const newSavedLists = [...savedLists]; // must use this syntax to update lists w/ Hooks
            newSavedLists[currentListIndex].content.push(entry);
            
            setSavedLists(newSavedLists);
        }
        
        if (listItems.includes(entry.item)) {
            setAddItemNameError({msg: 'That item already exists', err: true});
        }

        if (entry.quantity <= 0) {
            setAddItemQtyError({msg: 'Quantity must be > 0', err: true});
        }
    };

    /**
     * Checks to see if list exists in savedLists
     * @param {string} nameToCheck Name of list to check for existence
     * @returns Bool, whether list exists or not
     */
    const listNameExists = (nameToCheck) => {
        let exists = false;
        for (let i = 0; i < savedLists.length; i++) {
            const listName = savedLists[i].name;
            if (nameToCheck === listName) {
                exists = true;
            }            
        }

        return exists;
    };

    const submitNewList = (event) => {
        event.preventDefault();

        const listExists = listNameExists(newListName);

        if (listExists) {
            setNewListNameError({msg: 'A list with that name already exists', err: true});
        } else {
            const newList = {
                name: newListName,
                content: []
            };
            const newSavedLists = [...savedLists];
            newSavedLists.push(newList);
            setSavedLists(newSavedLists);
            setCurrentListIndex(savedLists.length); // Set current list to new list

            dialogCloseNewList();
            updateListCookie();
        }
    };

    const submitEditList = (event) => {
        event.preventDefault();

        const listExists = listNameExists(editListName);

        if (listExists) {
            setEditListNameError({msg: 'A list with that name already exists', err: true});
        } else {
            const newSavedLists = [...savedLists];
            newSavedLists[currentListIndex].name = editListName;
            setSavedLists(newSavedLists);

            dialogCloseEditList();
            updateListCookie();
        }
    };

    const deleteList = () => {
        if (savedLists.length < 2) {
            // If we only have one list, don't allow delete
            enqueueSnackbar("You must have at least one list", {variant: 'error'});
        } else {
            const newSavedLists = [...savedLists];
            newSavedLists.splice(currentListIndex, 1);
    
            // After deleting, need to set new current list
            // if deleting the latest list. Otherwise the current
            // list index will just be the previous list in the savedLists
            if (currentListIndex+1 === savedLists.length) {
                setCurrentListIndex(currentListIndex-1);
            }
            setSavedLists(newSavedLists);
            dialogCloseEditList();
            updateListCookie();
        }
    };

    const listItemIncrementQty = (listEntry) => {
        const newSavedLists = [...savedLists];
        const indexEntry = newSavedLists[currentListIndex].content.indexOf(listEntry); // Get index of item
        if (indexEntry !== -1) { // Make sure index exists
            newSavedLists[currentListIndex].content[indexEntry].quantity += 1; // Increment item qty by 1
        }
        setSavedLists(newSavedLists);
        updateListCookie();
    };

    const listItemDecrementQty = (listEntry) => {
        const newSavedLists = [...savedLists];
        const indexEntry = newSavedLists[currentListIndex].content.indexOf(listEntry); // Get index of item
        if (indexEntry !== -1) { // Make sure index exists
            if (newSavedLists[currentListIndex].content[indexEntry].quantity > 1) { // Ensure qty > 1
                newSavedLists[currentListIndex].content[indexEntry].quantity -= 1; // Decrement item qty by 1
            }
        }
        setSavedLists(newSavedLists);
        updateListCookie();
    };

    const listItemDelete = (listEntry) => {
        const newSavedLists = [...savedLists];
        const indexEntry = newSavedLists[currentListIndex].content.indexOf(listEntry); // Get index of item
        if (indexEntry !== -1) { // Make sure index exists
            newSavedLists[currentListIndex].content.splice(indexEntry, 1); // Remove from list
        }
        setSavedLists(newSavedLists);
        menuListItemHandleClose();
        updateListCookie();
    };

    const dialogCloseNewList = () => {
        setShowDialogNewList(false);
        setNewListName('');
        setNewListNameError(wipeErrorTextField);
    };

    const dialogCloseEditList = () => {
        setShowDialogEditList(false);
        setEditListName('');
        setEditListNameError(wipeErrorTextField);
    };

    const menuListItemhandleClick = (event) => {
        setMenuListItemAnchorEl(event.currentTarget);
    };
    
    const menuListItemHandleClose = () => {
        setMenuListItemAnchorEl(null);
    };

    const pageHeader = (
        <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
            <Grid item><h1>Shopping List</h1></Grid>
            <Grid item><IconButton type="button"><SaveIcon /></IconButton></Grid>
        </Grid>
    );

    const listSelection = (
        <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
            <Grid item>
            <FormControl variant="outlined" className="select-current-list-form">
                <InputLabel htmlFor="outlined-age-native-simple">Current List</InputLabel>
                <Select
                className="select-current-list"
                value={currentListIndex}
                onChange={(event) => {
                    setCurrentListIndex(event.target.value);
                    updateListCookie();
                }}
                label="Current List"
                >
                {savedLists.map((savedList, index) => (
                    <MenuItem key={index} value={index}>{savedList.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>
            <Grid item className="list-button">
                <IconButton type="button" onClick={() => setShowDialogNewList(true)}><AddIcon /></IconButton>
            </Grid>
            <Grid item className="list-button">
                <IconButton type="button" onClick={() => {
                    setShowDialogEditList(true);
                    setEditListName(savedLists[currentListIndex].name);
                }}><EditIcon /></IconButton>
            </Grid>
        </Grid>
    );

    const addItemForm = (
        <form style={{width:"100%", maxWidth:'600px'}}>
        <TextField variant="standard" name="item" id="input_item" label="Item" 
            onChange={handleItemChange}
            value={item}
            helperText={addItemNameError.msg} error={addItemNameError.err}
            style={{width:"65%"}}
        />
        <TextField
            variant="standard" name="quantity" label="Quantity" type="number"
            style={{width:"25%"}}
            onChange={handleQuantityChange}
            value={quantity}
            helperText={addItemQtyError.msg} error={addItemQtyError.err}
        />
        <IconButton onClick={submitItem} type="submit" aria-label="Add Item" style={{width:"10%", maxWidth:'48px'}}>
            <AddIcon />
        </IconButton>
    </form>
    );

    const listTableItems = savedLists[currentListIndex].content.map((entry) => {
        return (
        <TableRow key={entry['item']}>
            <TableCell id={"id_item_" + entry['item']}>{entry['item']}</TableCell>
            <TableCell>{entry['quantity']}</TableCell>
            <TableCell>
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={menuListItemhandleClick}>
                <MoreVertIcon />
                </IconButton>
                <Menu
                id="simple-menu"
                anchorEl={menuListItemAnchorEl}
                keepMounted
                open={Boolean(menuListItemAnchorEl)}
                onClose={menuListItemHandleClose}
                >
                <MenuItem onClick={() => listItemIncrementQty(entry)}><UpIcon />&nbsp;Increase</MenuItem>
                <MenuItem onClick={() => listItemDecrementQty(entry)}><DownIcon />&nbsp;Decrease</MenuItem>
                <br /><Divider /><br />
                <MenuItem onClick={() => listItemDelete(entry)}><DeleteIcon />&nbsp;Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
        );
    });

    const listTable = (
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
                    {listTableItems}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const dialogNewList = (
        <Dialog open={showDialogNewList} onClose={dialogCloseNewList} aria-labelledby="create-new-list">
            <DialogTitle id="create-new-list">New Shopping List</DialogTitle>
            <form>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="List Name"
                type="text"
                value={newListName}
                onChange={handleNewListNameChange}
                error={newListNameError.err}
                helperText={newListNameError.msg}
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button type="button" onClick={dialogCloseNewList} color="primary">
                Cancel
            </Button>
            <Button type="submit" onClick={submitNewList} color="primary">
                Create
            </Button>
            </DialogActions>
            </form>
        </Dialog>
    );

    const dialogEditList = (
        <Dialog open={showDialogEditList} onClose={dialogCloseEditList} aria-labelledby="edit-list">
            <DialogTitle id="edit-list">
            <Grid container direction="row" alignItems="center" justify="space-between">
                <Grid item>Manage {savedLists[currentListIndex].name}</Grid>
                <Grid item><IconButton type="button" onClick={deleteList}><DeleteIcon /></IconButton></Grid>
            </Grid>
            </DialogTitle>
                <DialogContent>
                <form>
                <TextField
                    autoFocus
                    margin="dense"
                    label={"List #" + (currentListIndex+1)}
                    type="text"
                    value={editListName}
                    onChange={handleEditListNameChange}
                    error={editListNameError.err}
                    helperText={editListNameError.msg}
                    fullWidth
                />
                <DialogActions>
                <Button type="button" onClick={dialogCloseEditList} color="primary">
                    Cancel
                </Button>
                <Button type="submit" onClick={submitEditList} color="primary">
                    Update Name
                </Button>
                </DialogActions>
                </form>
                </DialogContent>
        </Dialog>
    );

    return (
        <>
            {pageHeader}
            {listSelection}
            <br />
            {addItemForm}
            <br />
            {listTable}

            {dialogNewList}
            {dialogEditList}
        </>
    );
}

export default ShoppingList;