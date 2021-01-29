import React from 'react'
import DadJokeAPIGet from './DadJokeAPIGet'
import ShoppingList from './ShoppingList'

// Organization of all content happens here

function MasterContainer() { return (
    <div className="master-container">
        <DadJokeAPIGet></DadJokeAPIGet>
        <br />
        <ShoppingList></ShoppingList>
    </div>
);
}

export default MasterContainer;