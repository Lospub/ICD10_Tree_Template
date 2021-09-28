import PropTypes from 'prop-types';
import React from 'react';
import Filter from './filter';
import { setActiveNode, setFilter, resize } from '../Reducers/actions';

const propTypes = {
	filter: PropTypes.string.isRequired,
	timestamp: PropTypes.string
};

export default class Header extends React.PureComponent {
	componentDidMount() {
		resize();
	}

	handleClick() {
		setActiveNode(null);
		setFilter('');
	}

	// handleUpload() {
	// 	alert(`This is the feature for upload CSV file`);
	// }

	render() {
		return (
			<div id="header">
				<Filter filter={this.props.filter}/>
				<button onClick={this.handleClick}>Reset</button>
				{/* <button onClick={this.handleClick}>Upload CSV</button> */}
				<span>Last Updated: {this.props.timestamp}</span>
			</div>);
	}
}

Header.propTypes = propTypes;