import clone from 'clone';
import PropTypes from 'prop-types';
import React from 'react';
import Tree from 'react-tree-graph';
import { setActiveNode } from '../Reducers/actions';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const propTypes = {
	activeNode: PropTypes.string,
	info: PropTypes.object,
	data: PropTypes.object,
	filter: PropTypes.string,
	height: PropTypes.number,
	width: PropTypes.number
};

export default class TreeContainer extends React.PureComponent {
	handleClick(event, node) {
		setActiveNode(node);
	}

	DetailsAlert = (node, info) => {
		let code_desp = '';
		let category_desp = '';
		let section_desp = '';
		let chapter_desp = '';
		let AUROC = '';
		let AUPRC = '';
		let AP = '';
		for (let i = 0; i < info.data.length; i++){
			if (info.data[i].label == node) {
				code_desp = info.data[i].code_desp;
				category_desp = info.data[i].category_desp;
				section_desp = info.data[i].section_desp;
				chapter_desp = info.data[i].chapter_desp;
				AUROC = info.data[i].AUROC;
				AUPRC = info.data[i].AUPRC;
				AP = info.data[i].AP;
				confirmAlert({
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
			}else{
				confirmAlert({
					title: `Details for ${node}`,
					message: `There is no data for this node.`,
					buttons: [
					  {
						label: 'Close',
					  },
					]
				  })
			}
		}
	}

	onRightClick = (event, nodeKey) => {
		event.preventDefault();
		this.DetailsAlert(nodeKey, this.props.info);
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
		let root = this.props.activeNode ? this.getRoot(this.props.data) : this.props.data;

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
	}
}

TreeContainer.propTypes = propTypes;