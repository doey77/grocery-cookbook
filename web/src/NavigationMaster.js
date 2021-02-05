import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Icon from './images/favicon.png';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Grid from '@material-ui/core/Grid';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingIcon from '@material-ui/icons/ShoppingCart';
import UserIcon from '@material-ui/icons/AccountCircle';
import FridgeIcon from '@material-ui/icons/Kitchen';

// Import different pages here
import ShoppingList from './pages/ShoppingList';
import HomePage from './pages/Homepage';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: '1%',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  mainContent: {
    marginTop: -25,
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  }
}));

// Our navbar setup, as well as links to pages, is here
export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Router>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <Grid container direction="row" alignItems="center" wrap="nowrap">
            <Grid item>
              <img src={Icon} alt="Icon"></img>
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>&nbsp;Grocery Cookbook</Typography>
            </Grid>
          </Grid>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
        

          <Link className={classes.link} to="/">
          <ListItem button key="home">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
          </Link>

          <Link className={classes.link} to="/shoppinglist/">
          <ListItem button key="shopping_list">
            <ListItemIcon><ShoppingIcon /></ListItemIcon>
            <ListItemText>Shopping List</ListItemText>
          </ListItem>
          </Link>

          <Link className={classes.link} to="/recipes/">
          <ListItem button key="recipes">
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText>Recipes</ListItemText>
          </ListItem>
          </Link>

          <Link className={classes.link} to="/fridgetracker/">
          <ListItem button key="fridgetracker">
            <ListItemIcon><FridgeIcon /></ListItemIcon>
            <ListItemText>Fridge Tracker</ListItemText>
          </ListItem>
          </Link>

          <br /><Divider /><br />

          <Link className={classes.link} to="/login/">
          <ListItem button key="login">
            <ListItemIcon><UserIcon /></ListItemIcon>
            <ListItemText>Login</ListItemText>
          </ListItem>
          </Link>
        
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.mainContent}>
        <Grid container spacing={0} direction="column" 
        alignItems="center" justify="center" 
        >
        <Grid item>
        <Switch>
          <Route exact path="/">
            <HomePage></HomePage>
          </Route>
          <Route path="/shoppinglist/">
            <ShoppingList></ShoppingList>
          </Route>
          <Route path="/recipes/">
            <p>Recipes</p>
          </Route>
          <Route path="/fridgetracker/">
            <p>Fridge Tracker here</p>
          </Route>
          <Route path="/login/">
            <p>Login page here</p>
          </Route>
        </Switch>
        </Grid>
        </Grid>
        </div>
      </main>
      </Router>
    </div>
  );
}