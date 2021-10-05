import PropTypes from 'prop-types';
import React from 'react';
import Filter from './filter';
import { setActiveNode, setFilter, resize } from '../Reducers/actions';
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();
const chapter = new Array();
export const data_jsons = {_data:[]};
export const json = {name:"ICD-10", children:[]};

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
	
	//helping function for sorting the object array
	//https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
	compareValues = (key, order = 'asc') => {
		return function innerSort(a, b) {
		  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			// property doesn't exist on either object
			return 0;
		  }
	  
		  const varA = (typeof a[key] === 'string')
			? a[key].toUpperCase() : a[key];
		  const varB = (typeof b[key] === 'string')
			? b[key].toUpperCase() : b[key];
	  
		  let comparison = 0;
		  if (varA > varB) {
			comparison = 1;
		  } else if (varA < varB) {
			comparison = -1;
		  }
		  return (
			(order === 'desc') ? (comparison * -1) : comparison
		  );
		};
	  }

	handleOnFileLoad = (data) => {
		console.log('----------LOAD---------');
		console.log(data);

		//set data_jsons
		data.map(function(item){
			if (item.data.chapter_desp == ""){
				data_jsons._data.push({
					label: item.data.labels,
					code_desp: item.data.code_desp,
					category_desp: item.data.category_desp,
					section_desp: item.data[" section_desp"],
					chapter_desp: "none",
					AUROC: item.data.AUROC,
					AUPRC: item.data.AUPRC,
					AP: item.data.AP
				})
			}else{
				data_jsons._data.push({
				label: item.data.labels,
				code_desp: item.data.code_desp,
				category_desp: item.data.category_desp,
				section_desp: item.data[" section_desp"],
				chapter_desp: item.data.chapter_desp,
				AUROC: item.data.AUROC,
				AUPRC: item.data.AUPRC,
				AP: item.data.AP
			})}	
		})

		// get all chapters
		let index = 0;
		for (let i = 0; i < data_jsons._data.length; i++){
			if ((chapter.includes(data_jsons._data[i].chapter_desp)) == false) {
				chapter[index] = data_jsons._data[i].chapter_desp
				index += 1
			}
		}

		// initial first child level
		chapter.sort()
		console.log('chapter list: ', chapter)
		for (let i = 0; i < chapter.length; i++){
			json.children.push({
				name: chapter[i],
				children: []
			})
		}

		// initail second child level
		data_jsons._data.sort(this.compareValues('label'))
		for (let i = 0; i < json.children.length; i++){
			for (let j = 0; j < data_jsons._data.length; j++){
				if (data_jsons._data[j].chapter_desp == json.children[i].name){
					json.children[i].children.push({
						name: data_jsons._data[j].label,
						children: []
					})
				}
			}
		}
		console.log('json list: ', json)

		console.log('----------data_json-----------');
		console.log(data_jsons)
	};
	
	handleOnError = (err, file, inputElem, reason) => {
		console.log('----------ERROR------------');
		console.log(err);
		console.log('---------------------------');
	};
	
	handleOnRemoveFile = (data) => {
		console.log('---------REMOVE-------------');
		console.log(data);
		for (let i=0; i < data_jsons._data.length; i++){
			data_jsons._data.splice(i)
		}
		for (let i = 0; i < json.children.length; i++){
			for (let j = 0; j < json.children[i].children.length; j++){
				json.children[i].children.splice(j)
			}
			json.children.splice(i)
		}
		console.log(json)
		console.log('---------data_json------------');
		console.log(data_jsons)
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
					accept = 'text/csv, .csv, application/vnd.ms-excel'
					ref={buttonRef}
					onFileLoad={this.handleOnFileLoad}
					onError={this.handleOnError}
					noClick
					noDrag
					onRemoveFile={this.handleOnRemoveFile}
					config={{header: true}}
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
							{file !== null ?
							<div>{file && file.name}</div>
							: <div style={{color:'#708090'}}>Upload .csv file</div>
							}
							
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