import React from 'react';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import Icon from './favicon.png'
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

import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';

import { Button } from '@material-ui/core';

import Homepage from './Homepage';

// Navigation components set up here. Content goes in MasterContainer

const drawerWidth = 240;
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})
const styles = {
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
    marginRight: 36,
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
};

const icon_style = { marginTop: -7 }

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 'home',
      open: false,
    }
  }

  handleDrawerOpen() {
    this.setState({open:true});
  };

  handleDrawerClose() {
    this.setState({open:false})
  };

  render() {
    return(
      <div className={styles.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(styles.appBar, {
            [styles.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(styles.menuButton, {
                [styles.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              <img src={Icon} alt="Icon" style={icon_style}></img> Grocery Cookbook
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(styles.drawer, {
            [styles.drawerOpen]: this.state.open,
            [styles.drawerClose]: !this.state.open,
          })}
          styles={{
            paper: clsx({
              [styles.drawerOpen]: this.state.open,
              [styles.drawerClose]: !this.state.open,
            }),
          }}
        >
          <div className={styles.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key="home">
              <ListItemIcon><HomeIcon></HomeIcon></ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button key="shopping_list">
              <ListItemIcon><ListAltIcon></ListAltIcon></ListItemIcon>
              <ListItemText>Shopping List</ListItemText>
            </ListItem>
          </List>
        </Drawer>
        <main className={styles.content}>
          <div className={styles.toolbar} />
          <Homepage></Homepage>
        </main>
      </div>
    );
  }
}

// export default function MiniDrawer() {
//   const classes = useStyles();
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         className={clsx(classes.appBar, {
//           [classes.appBarShift]: open,
//         })}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             className={clsx(classes.menuButton, {
//               [classes.hide]: open,
//             })}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap>
//             <img src={Icon} alt="Icon" style={icon_style}></img> Grocery Cookbook
//           </Typography>
//           <Button color="inherit">Login</Button>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         className={clsx(classes.drawer, {
//           [classes.drawerOpen]: open,
//           [classes.drawerClose]: !open,
//         })}
//         classes={{
//           paper: clsx({
//             [classes.drawerOpen]: open,
//             [classes.drawerClose]: !open,
//           }),
//         }}
//       >
//         <div className={classes.toolbar}>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//           </IconButton>
//         </div>
//         <Divider />
//         <List>
//           <ListItem button key="home">
//             <ListItemIcon><HomeIcon></HomeIcon></ListItemIcon>
//             <ListItemText>Home</ListItemText>
//           </ListItem>
//           <ListItem button key="shopping_list">
//             <ListItemIcon><ListAltIcon></ListAltIcon></ListItemIcon>
//             <ListItemText>Shopping List</ListItemText>
//           </ListItem>
//         </List>
//       </Drawer>
//       <main className={classes.content}>
//         <div className={classes.toolbar} />
//         <Homepage></Homepage>
//       </main>
//     </div>
//   );
// }

export default Nav;