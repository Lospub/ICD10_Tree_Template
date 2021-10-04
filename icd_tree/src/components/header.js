import PropTypes from 'prop-types';
import React from 'react';
import Filter from './filter';
import { setActiveNode, setFilter, resize } from '../Reducers/actions';
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();

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

	handleOpenDialog = (e) => {
		// Note that the ref is set async, so it might be null at some point
		if (buttonRef.current) {
		  buttonRef.current.open(e);
		}
	  };
	
	  handleOnFileLoad = (data) => {
		console.log('---------------------------');
		console.log(data);
		console.log('---------------------------');
	  };
	
	  handleOnError = (err, file, inputElem, reason) => {
		console.log('---------------------------');
		console.log(err);
		console.log('---------------------------');
	  };
	
	  handleOnRemoveFile = (data) => {
		console.log('---------------------------');
		console.log(data);
		console.log('---------------------------');
	  };
	
	  handleRemoveFile = (e) => {
		// Note that the ref is set async, so it might be null at some point
		if (buttonRef.current) {
		  buttonRef.current.removeFile(e);
		}
	  };

	render() {
		return (
			<div id="header">
				<Filter filter={this.props.filter}/>
				<button onClick={this.handleClick}>Reset Tree</button>
				<span>Last Updated: {this.props.timestamp}</span>
				<CSVReader
					ref={buttonRef}
					onFileLoad={this.handleOnFileLoad}
					onError={this.handleOnError}
					noClick
					noDrag
					onRemoveFile={this.handleOnRemoveFile}
					>
					{({ file }) => (
						<aside
						style={{
							display: 'flex',
							flexDirection: 'row',
						}}
						>
						<button
							style={{marginTop:5}}
							onClick={this.handleOpenDialog}
						>
							Browse file
						</button>
						<div
							style={{
							borderWidth: 1,
							background:'#F4F4F4',
							borderStyle: 'solid',
							borderColor: '#ccc',
							borderRadius: 50,
							height: 22,
							marginLeft: 5,
							marginTop: 5,
							paddingLeft: 13,
							paddingTop: 3,
							width: '60%',
							}}
						>
							{file && file.name}
						</div>
						<button
							style={{marginTop: 5}}
							onClick={this.handleRemoveFile}
						>
							Remove
						</button>
						</aside>
					)}
					</CSVReader>
			</div>);
	}
}

Header.propTypes = propTypes;