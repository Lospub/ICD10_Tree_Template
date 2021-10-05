import clone from 'clone';
import PropTypes from 'prop-types';
import React from 'react';
import Tree from 'react-tree-graph';
import { setActiveNode } from '../Reducers/actions';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { data_jsons, json } from './header';

const propTypes = {
	activeNode: PropTypes.string,
	// info: PropTypes.object,
	// data: PropTypes.object,
	filter: PropTypes.string,
	height: PropTypes.number,
	width: PropTypes.number
};

export default class TreeContainer extends React.PureComponent {
	handleClick(event, node) {
		setActiveNode(node);
	}

	DetailsAlert = (node, info) => {
		for (let i = 0; i < info._data.length; i++){
			let code_desp = '';
			let category_desp = '';
			let section_desp = '';
			let chapter_desp = '';
			let AUROC = '';
			let AUPRC = '';
			let AP = '';
			if (info._data[i].label == node) {
				code_desp = info._data[i].code_desp;
				category_desp = info._data[i].category_desp;
				section_desp = info._data[i].section_desp;
				chapter_desp = info._data[i].chapter_desp;
				AUROC = info._data[i].AUROC;
				AUPRC = info._data[i].AUPRC;
				AP = info._data[i].AP;
				return confirmAlert({
					customUI: ({ onClose }) => {
						return (
						  <div className='custom-ui'>
							<h1>Details for {node}</h1>
							<h2>code_desp: {code_desp}</h2>
							<h2>category_desp: {category_desp}</h2>
							<h2>section_desp: {section_desp}</h2>
							<h2>chapter_desp: {chapter_desp}</h2>
							<h2>AUROC: {AUROC}</h2>
							<h2>AUPRC: {AUPRC}</h2>
							<h2>AP: {AP}</h2>
							<button onClick={onClose}>CLOSE</button>
						  </div>
						)
					  }
					})
			}else if (info._data[i].chapter_desp == node){
				section_desp = info._data[i].section_desp;
				return confirmAlert({
					customUI: ({ onClose }) => {
						return (
						  <div className='custom-ui'>
							<h1>Details for {node}</h1>
							<h2>section_desp: {section_desp}</h2>
							<button onClick={onClose}>CLOSE</button>
						  </div>
						)
					  }
					})
			}else if (node == "ICD-10"){
				return confirmAlert({
					customUI: ({ onClose }) => {
						return (
						  <div className='custom-ui'>
							<h1 style={{marginLeft:100}}>Details for {node}</h1>
							<h2 style={{marginLeft:100, marginRight:500}}>ICD-10 is the 10th revision of the International Statistical Classification of Diseases and Related Health Problems, a medical classification list by the World Health Organization.{section_desp}</h2>
							<button style={{marginLeft:100}} onClick={onClose}>CLOSE</button>
						  </div>
						)
					  }
					})
			}
		}
	}

	onRightClick = (event, nodeKey) => {
		event.preventDefault();
		this.DetailsAlert(nodeKey, data_jsons);
	}
	
	getRoot(json) {
		if (json.name === this.props.activeNode) {
			return json;
		}
		for (let i = 0; i < json.children.length; i++) {
			let childJson = this.getRoot(json.children[i]);
			if (childJson) {
				return childJson;
			}
		}
		return false;
	}

	buildSubTree(root) {
		let newChildren = [];

		for (let i = 0; i < root.children.length; i++) {
			let child = this.buildSubTree(root.children[i]);
			if (child) {
				newChildren.push(child);
			}
		}

		if (newChildren.length > 0) {
			root.children = newChildren;
		}

		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) !== -1) {
			return root;
		}
		return null;
	}

	setClassName(node) {
		node.children.forEach(this.setClassName, this);

		if (!this.props.filter) {
			return;
		}

		node.className = node.name.toLowerCase().indexOf(this.props.filter) === -1
			? 'node searchExcluded'
			: 'node searchIncluded';
	}

	render() {
		if (json.children.length > 0 ){
			let root = this.props.activeNode ? this.getRoot(json) : json;

			root = clone(root);

			if (this.props.filter) {
				root = this.buildSubTree(root) || root;
			}

			this.setClassName(root);

			return (
				<Tree
					animated
					data={root}
					height={this.props.height}
					width={this.props.width}
					gProps={{
						className: 'node',
						onClick: this.handleClick,
						onContextMenu: this.onRightClick
					}}
					textProps={{
						dy: 3.5
					}}
					steps={30}/>);
		}else{
			return (
				<div style={{color:'white', marginTop: 20}}>
					Please upload file to display the tree.
				</div>
			);
		}
	}
}

TreeContainer.propTypes = propTypes;