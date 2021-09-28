export default {

	name: 'ICD-10',
	children: [{
		name: 'A',
		children: []
	}, {
		name: 'B',
		children: [{
			name: 'B01',
			details: 'This is detail for BO1',
			children: [{
				name: 'B01.0',
				children: [{
					name: 'B01.01',
					children: []
				}, {
					name: 'B01.02',
					children: []
				}]
			}, {
				name: 'B01.1',
				children: []
			}]
		}, {
			name: 'B02',
			children: []
		}, {
			name: 'B03',
			children: []
		}, {
			name: 'B04',
			children: []
		}]
	}, {
		name: 'C',
		children: []
	}, {
		name: 'D',
		children: [{
			name: 'D01',
			children: []
		}, {
			name: 'D02',
			children: []
		}]
	}, {
		name: 'H',
		children: [{
			name: 'H01',
			children: []
		}, {
			name: 'H02',
			children: []
		}, {
			name: 'H03',
			children: []
		}]
	}, {
		name: 'I',
		children: []
	}, {
		name: 'J',
		children: []
	}]
};