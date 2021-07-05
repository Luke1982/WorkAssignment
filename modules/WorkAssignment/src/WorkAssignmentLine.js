import React, {useState, useEffect} from 'react'

import Input from '@salesforce/design-system-react/components/input'; 
import InputIcon from '@salesforce/design-system-react/components/icon/input-icon';
import ProductAutoCompleteComponent from './ProductAutoCompleteComponent'
import ComboBoxComponent from './ComboBoxComponent'
import WorkAssignmentLineActions from './WorkAssignmentLineActions'
import WorkAssignmentLineAssets from './WorkAssignmentLineAssets'
import WorkAssignmentLineSubProducts from './WorkAssignmentLineSubProducts'
import Card from '@salesforce/design-system-react/components/card';
import Icon from '@salesforce/design-system-react/components/icon';

const WorkAssignmentLine = React.forwardRef((props, ref) => {
	const [qty, setQty] = useState('0')
	const [qtyDelivered, setQtyDelivered] = useState('0')
	const [productName, setProductName] = useState('')
	const [productId, setProductId] = useState('')
	const [productType, setProductType] = useState('Products')
	const [assets, setAssets] = useState([])
	const [subProducts, setSubProducts] = useState([])
	const [remarks, setRemarks] = useState('')
	const [disabled, setDisabled] = useState(true)
	const [expanded, setExpanded] = useState(false)
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

	const handleProductSelection = async data => {
		const response = await fetch(
			`index.php?action=WorkAssignmentAjax&module=WorkAssignment&file=WorkAssignmentAPI&function=getPartsForProduct&productid=${data.result.meta.id}`
		)
		const collectedParts = await response.json();
		const preparedParts = collectedParts.map(part => {
			part.originalQty = part.quantity
			return part
		})
		setSubProducts(preparedParts)
		setProductId(data.result.meta.id)
		setProductType(data.result.meta.type)
	}

	const updateQty = e => {
		setQty(e.target.value)
		const newSubProducts = subProducts.map(subProduct => {
			subProduct.quantity = Number(subProduct.originalQty) * Number(e.target.value)
			return subProduct
		})
		setSubProducts(newSubProducts)
	}

	useEffect(() => {
		setQty(props.quantity ? props.quantity : '0')
		setQtyDelivered(props.delivered ? props.delivered : '0')
		setProductName(props.productname ? props.productname : '')
		setRemarks(props.description ? props.description : '')
		setProductId(props.productid ? props.productid : '')
		setProductType(props.producttype ? props.producttype : '')
	}, [])

	return (
		<div ref={ref} id={`workassignmentline-${props.id}`} className="slds-grid slds-gutters_x-small slds-m-bottom_x-small slds-wrap slds-box slds-box_xx-small slds-theme_shade">
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
					label="Aantal"
					value={qty}
					onChange={updateQty}
					disabled={disabled}
				/>
			</div>
			<div className="slds-col slds-size_3-of-12">
				<ProductAutoCompleteComponent
					onSelect={handleProductSelection}
					disabled={disabled}
					value={productName}
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
					label="Aantal geleverd"
					value={qtyDelivered}
					onChange={e => setQtyDelivered(e.target.value)}
					disabled
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
					label="Locatie in werkplaats"
					disabled
				/>
			</div>
			<div className="slds-col slds-size_2-of-12">
				<ComboBoxComponent
					options={workshopStatus}
					onSelect={updateWorkshopStatus}
					disabled
				/>
			</div>
			<div className="slds-col slds-size_2-of-12">
				<WorkAssignmentLineActions
					expanded={expanded}
					setExpanded={setExpanded}
				/>
			</div>
			{expanded &&
				<>
					<div className="slds-col slds-size_4-of-12">
						<WorkAssignmentLineAssets
							assets={assets}
							setAssets={setAssets}
						/>
					</div>
					<div className="slds-col slds-size_4-of-12">
						<WorkAssignmentLineSubProducts
							parts={subProducts}
						/>
					</div>
					<div className="slds-col slds-size_4-of-12">
						<Card
							heading="Opmerkingen"
							icon={<Icon category="standard" name="display_text" size="small" />}
							className="slds-m-top_small"
						>
							<textarea
								className="slds-textarea slds-m-around_small"
								style={{width: 'calc(100% - 1.5rem)'}}
								onChange={e => {setRemarks(e.target.value)}}
								value={remarks}
							>{remarks}</textarea>
						</Card>
					</div>
				</>
			}
		</div>
	)
})

export default WorkAssignmentLine