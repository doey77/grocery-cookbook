import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Icon from './images/favicon.png';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
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
import { SnackbarProvider, withSnackbar } from 'notistack';

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
import LoginPage from './pages/Login';
import FridgeTracker from './pages/FridgeTracker';
import Recipes from './pages/Recipes';

import { loginToken, logout } from './services/login';

// Import app-wide contexts here
import { userContext } from './contexts/userContext';

import axios from 'axios';
import apiSettings from './services/apiSettings';

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
}));

// Our navbar setup, as well as links to pages, is here
function MiniDrawer(props) {
  const classes = useStyles();
  // https://material-ui.com/customization/color/
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#7986cb',
      },
      secondary: {
        main: '#ff1744',
      },
      type: 'dark',
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const notistackRef = React.useRef();

  return (
    <ThemeProvider theme={theme} >
      <SnackbarProvider anchorOrigin={{horizontal: 'center', vertical: 'top'}}
        ref={notistackRef}
        action={(key) => (
            <Button onClick={() => notistackRef.current.closeSnackbar(key)}
              style={{ color: '#fff', fontSize: '15px' }}>✖</Button>
        )}
      >
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
        
          {/* Links */}
          <ListItem button component={Link} to={"/"} key="home">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>

          <ListItem button component={Link} to={"/shoppinglist/"} key="shoppinglist">
            <ListItemIcon><ShoppingIcon /></ListItemIcon>
            <ListItemText>Shopping List</ListItemText>
          </ListItem>

          <ListItem button component={Link} to={"/recipes/"} key="recipes">
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText color="primary">Recipes</ListItemText>
          </ListItem>

          <ListItem button component={Link} to={"/fridgetracker/"} key="fridgetracker">
            <ListItemIcon><FridgeIcon /></ListItemIcon>
            <ListItemText>Fridge Tracker</ListItemText>
          </ListItem>

          <br /><Divider /><br />

          <ListItem button component={Link} to={"/login/"} key="login">
            <ListItemIcon><UserIcon /></ListItemIcon>
            <ListItemText>Login</ListItemText>
          </ListItem>
          {/* Links */}

        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
        <Grid container spacing={0} direction="row"
        alignItems="center" justify="center"
        >

        <Grid item>
        {/* Routes */}
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/shoppinglist/">
            <ShoppingList />
          </Route>
          <Route path="/recipes/">
            <Recipes />
          </Route>
          <Route path="/fridgetracker/">
            <FridgeTracker />
          </Route>
          <Route path="/login/">
            <LoginPage />
          </Route>
        </Switch>
        {/* Routes */}
        </Grid>        

        </Grid>
        </div>
      </main>
      </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: false,
      email: null, // string
      id: null, // int
      isSuperuser: false,
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    logout();
    this.setState({
      isAuthorized: false,
      email: null,
    });
  }

  componentDidMount() {
    loginToken();
  }

  render() {

    const value = {
      isAuthorized: this.state.isAuthorized,
      email: this.state.email,
      id: this.state.id,
      isSuperuser: this.state.isSuperuser,
      loginToken: this.loginToken,
      logout: this.logout,
    };

    return (
      <userContext.Provider value={value}>
        <MiniDrawer />
      </userContext.Provider>
    );
  }
}

export default App;