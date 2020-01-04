import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemText, Divider } from '@material-ui/core';

const drawerWidth = 150;

const useStyles = makeStyles(theme => ({
	toolbar: theme.mixins.toolbar,

	drawer: props => ({
		width: props.width ? props.width: drawerWidth,
		flexShrink: 0,
	}),
	drawerPaper: props => ({
		width: props.width ? props.width: drawerWidth,
		zIndex: theme.zIndex.appBar - 1,
	}),
}));

export default function TeamDrawer(props) {
	const { width, teams, onSelect, selected } = props;
	const classes = useStyles({ width: width });

	return (
		<React.Fragment>
			<Drawer
			className={classes.drawer}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper,
			}}
			>
				<div className={classes.toolbar} />
				<List>
					<ListItem button key={'all'} selected={selected === 'all'} onClick={() => onSelect('all')}>
						<ListItemText primary={'All teams'} />
					</ListItem>
					<Divider />
					{teams.map(team => (
						<ListItem button key={team} selected={selected === team} onClick={() => onSelect(team)}>
							<ListItemText primary={'Team ' + team} />
						</ListItem>
					))}
				</List>
			</Drawer>
		</React.Fragment>
	)
};