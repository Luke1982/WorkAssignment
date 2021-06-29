import React, {useState} from 'react'

import Input from '@salesforce/design-system-react/components/input'; 
import InputIcon from '@salesforce/design-system-react/components/icon/input-icon';
import ProductAutoCompleteComponent from './ProductAutoCompleteComponent'
import ComboBoxComponent from './ComboBoxComponent'
import WorkAssignmentLineActions from './WorkAssignmentLineActions'
import WorkAssignmentLineAssets from './WorkAssignmentLineAssets'

const WorkAssignmentLine = () => {
	const [qty, setQty] = useState(0)
	const [qtyDelivered, setQtyDelivered] = useState(0)
	const [productId, setProductId] = useState(0)
	const [productType, setProductType] = useState('Products')
	const [workshopStatus, setWorkshopStatus] = useState([
		{
			value: 'not_prepared',
			label: 'Geen voorbereiding',
			selected: false
		},
		{
			value: 'being_prepared',
			label: 'Wordt voorbereid',
			selected: true
		},
		{
			value: 'ready',
			label: 'Ligt klaar',
			selected: false
		}
	])
	
	const updateWorkshopStatus = val => {
		const newStatus = workshopStatus.filter(status => {
			status.selected = status.value === val
			return status
		})
		setWorkshopStatus(newStatus)
	}

	const handleProductSelection = data => {
		console.log(data)
	}

	return (
		<div className="slds-grid slds-gutters_x-small slds-m-bottom_x-small slds-wrap">
			<div className="slds-col slds-size_1-of-12">
				<Input
					iconLeft={
						<InputIcon
							assistiveText={{
								icon: 'Search',
							}}
							name="number_input"
							category="utility"
						/>
					}
					id="qty"
				/>
			</div>
			<div className="slds-col slds-size_3-of-12">
				<ProductAutoCompleteComponent
					onSelect={handleProductSelection}
				/>
			</div>
			<div className="slds-col slds-size_1-of-12">
				<Input
					iconLeft={
						<InputIcon
							assistiveText={{
								icon: 'Search',
							}}
							name="number_input"
							category="utility"
						/>
					}
					id="qty-delivered"
				/>
			</div>
			<div className="slds-col slds-size_3-of-12">
				<Input
					iconLeft={
						<InputIcon
							assistiveText={{
								icon: 'Locatie werkplaats',
							}}
							name="checkin"
							category="utility"
						/>
					}
					id="workshop-location"
				/>
			</div>
			<div className="slds-col slds-size_2-of-12">
				<ComboBoxComponent
					options={workshopStatus}
					onSelect={updateWorkshopStatus}
				/>
			</div>
			<div className="slds-col slds-size_2-of-12">
				<WorkAssignmentLineActions />
			</div>
			<div className="slds-col slds-size_4-of-12">
				<WorkAssignmentLineAssets />
			</div>
		</div>
	)
}

export default WorkAssignmentLine