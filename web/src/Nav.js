import React from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

// Icons
import FavIcon from './images/favicon.png';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingIcon from '@material-ui/icons/ShoppingCart';
import UserIcon from '@material-ui/icons/AccountCircle';
import FridgeIcon from '@material-ui/icons/Kitchen';
import ListAltIcon from '@material-ui/icons/ListAlt';

// Import different pages here
import ShoppingList from './pages/ShoppingList';
import HomePage from './pages/Homepage';
import LoginPage from './pages/Login';
import FridgeTracker from './pages/FridgeTracker';
import Recipes from './pages/Recipes';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    maxWidth: '1192px',
    margin: '0 auto',
    width: '100%',
  },
}));

function ResponsiveDrawer(props) {
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const notistackRef = React.useRef();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
          {/* Links */}
          <ListItem button onClick={handleDrawerToggle} component={Link} to={"/"} key="home">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>

          <ListItem button onClick={handleDrawerToggle} component={Link} to={"/shoppinglist/"} key="shoppinglist">
            <ListItemIcon><ShoppingIcon /></ListItemIcon>
            <ListItemText>Shopping List</ListItemText>
          </ListItem>

          <ListItem button onClick={handleDrawerToggle} component={Link} to={"/recipes/"} key="recipes">
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText color="primary">Recipes</ListItemText>
          </ListItem>

          <ListItem button onClick={handleDrawerToggle} component={Link} to={"/fridgetracker/"} key="fridgetracker">
            <ListItemIcon><FridgeIcon /></ListItemIcon>
            <ListItemText>Fridge Tracker</ListItemText>
          </ListItem>

          <br /><Divider /><br />

          <ListItem button onClick={handleDrawerToggle} component={Link} to={"/login/"} key="login">
            <ListItemIcon><UserIcon /></ListItemIcon>
            <ListItemText>Login</ListItemText>
          </ListItem>
          {/* Links */}
      </List>
    </div>
  );

  const routes = (
    <Switch>
        {/* Routes */}
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
        {/* Routes */}
      </Switch>
  );

  return (
    <div className={classes.root}>
    <ThemeProvider theme={theme}>
    <SnackbarProvider anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        ref={notistackRef}
        action={(key) => (
            <Button onClick={() => notistackRef.current.closeSnackbar(key)}
              style={{ color: '#fff', fontSize: '15px' }}>✖</Button>
        )}
    >
    <Router>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Grid container direction="row" alignItems="center" wrap="nowrap">
            <Grid item>
              <img src={FavIcon} alt="Icon"></img>
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>&nbsp;Grocery Cookbook</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="js">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
          {routes}
      </main>
    </Router>
    </SnackbarProvider>
    </ThemeProvider>
    </div>
  );
}

export default ResponsiveDrawer;
