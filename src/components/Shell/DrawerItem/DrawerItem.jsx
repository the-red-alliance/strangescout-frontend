// modified from https://material-ui.com/guides/composition/#ListRouter.js

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
	drawerItemIcon: {
		marginRight: '-15px'
	},
	drawerItemText: {
		marginTop: '5px'
	},
});

export function DrawerItem(props) {
	const { icon, primary, to } = props;
	const classes = useStyles();

	// define an alternate router link component going to our passed url
	const renderLink = React.useMemo(
		() => React.forwardRef(
			(itemProps, ref) => (
				<Link to={to} {...itemProps} innerRef={ref} />
			)
		),
		[to]
	);

	return (
		<React.Fragment>
			{/* use our renderLink component instead of the default */}
			<ListItem button key={primary} component={renderLink}>
				{/* if we passed in an icon render it */}
				{icon ? <ListItemIcon className={classes.drawerItemIcon}>{icon}</ListItemIcon> : null}
				<ListItemText primary={primary} className={classes.drawerItemText} />
			</ListItem>
		</React.Fragment>
	);
};

DrawerItem.propTypes = {
	icon: PropTypes.element,
	primary: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
};
