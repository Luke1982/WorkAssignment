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
	const [qty, setQty] = useState(0)
	const [qtyDelivered, setQtyDelivered] = useState(0)
	const [productName, setProductName] = useState('')
	const [productId, setProductId] = useState('')
	const [productType, setProductType] = useState('Products')
	const [assets, setAssets] = useState([])
	const [subProducts, setSubProducts] = useState([])
	const [remarks, setRemarks] = useState('')
	const [disabled, setDisabled] = useState(true)
	const [expanded, setExpanded] = useState(false)
	const [qtyInStock, setQtyInStock] = useState(0)
	const [enoughParts, setEnoughParts] = useState(true)
	const [detailsType, setDetailsType] = useState(props.detailstype)
	const [workshopStatus, setWorkshopStatus] = useState([
		{
			value: '--None--',
			label: 'Geen',
			selected: true
		},
		{
			value: 'not_prepared',
			label: 'Geen voorbereiding',
			selected: false
		},
		{
			value: 'being_prepared',
			label: 'Wordt voorbereid',
			selected: false
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
		props.updateLineProp(props.id, 'workshopstatus', val)
		setWorkshopStatus(newStatus)
	}

	const handleProductSelection = async data => {
		const preparedParts = await getProductPartsById(data.result.meta.id)
		setSubProducts(preparedParts)
		setProductId(data.result.meta.id)
		setProductType(data.result.meta.type)
	}

	const getProductPartsById = async id => {
		const response = await fetch(
			`index.php?action=WorkAssignmentAjax&module=WorkAssignment&file=WorkAssignmentAPI&function=getPartsForProduct&productid=${id}`
		)
		const collectedParts = await response.json();
		const preparedParts = collectedParts.map(part => {
			part.originalQty = part.quantity
			return part
		})
		return preparedParts
	}

	const updateQtyFromInput = e => {
		setQty(e.target.value)
		setSubProducts(getRelativeSubQtys(e.target.value, subProducts))
	}

	const getRelativeSubQtys = (qty, subProducts) => {
		const newSubProducts = subProducts.map(subProduct => {
			subProduct.quantity = Number(subProduct.originalQty) * Number(qty)
			return subProduct
		})
		return newSubProducts
	}

	useEffect(() => {
		let mounted = true
		setQty(props.quantity ? Number(props.quantity) : 0)
		setQtyDelivered(props.delivered ? Number(props.delivered) : 0)
		setProductName(props.productname ? props.productname : '')
		setRemarks(props.description ? props.description : '')
		setProductId(props.productid ? props.productid : '')
		setProductType(props.producttype ? props.producttype : '')
		setQtyInStock(props.qtyinstock ? Number(props.qtyinstock) : 0)
		const setProductParts = async () => {
			const preparedParts = await getProductPartsById(props.productid)
			const adjustedPartsList = getRelativeSubQtys(props.quantity, preparedParts)
			if (mounted) {
				setSubProducts(adjustedPartsList)
			}
		}
		setProductParts()
		return () => {mounted = false}
	}, [])

	useEffect(() => {
		const deficitParts = subProducts.find(p => p.quantity > Number(p.qtyinstock))
		setEnoughParts(deficitParts === undefined)
	}, [subProducts])

	const deleteMe = () => {
		props.deleteLine(props.id, detailsType)
	}

	const updateRemarks = value => {
		props.updateLineProp(props.id, 'description', value)
		setRemarks(value)
	}

	const stockIconInfo = {
		label: qty > qtyInStock ? 'Er is niet genoeg op voorraad' : 'Er is genoeg op voorraad',
		color: qty > qtyInStock ? '#c23934' : '#3bd308',
		icon: qty > qtyInStock ? 'warning' : 'check',
		message: qty > qtyInStock ? `Er ${qtyInStock > 1 ? 'zijn' : 'is'} er maar ${qtyInStock} op voorraad` : `Er zijn er ${qtyInStock} op voorraad`
	}

	const partsIconInfo = {
		label: enoughParts ? 'Er zijn genoeg onderdelen op voorraad' : 'Er zijn niet genoeg onderdelen op voorraad',
		color: enoughParts ? '#3bd308' : '#c23934',
		icon: enoughParts ? 'check' : 'warning',
	}

	return (
		<div ref={ref} id={`workassignmentline-${props.id}`} className="slds-grid slds-gutters_x-small slds-m-bottom_x-small slds-box slds-box_xx-small slds-theme_shade">
			<div className="slds-col slds-size_1-of-12">
				{productType === 'Products' &&
					<div className="slds-grid slds-m-top_small">
						<div className="slds-col slds-size_10-of-12">
							<div className="slds-text-title">Genoeg?</div>
						</div>
						<div 
							className="slds-col"
							onClick={() => {ldsPrompt.show('Voorraad', stockIconInfo.message)}}
							style={{cursor: 'pointer'}}
						>
							<Icon
								assistiveText={{ label: stockIconInfo.label }}
								category="utility"
								style={{fill: stockIconInfo.color}}
								name={stockIconInfo.icon}
								size="x-small"
							/>
						</div>
					</div>
				}
				{/* <div className="slds-grid slds-m-top_x-small">
					<div className="slds-col slds-size_10-of-12">
						<div className="slds-text-title">Gereserveerd?</div>
					</div>
					<div className="slds-col">
						<Icon
							assistiveText={{ label: 'Warning' }}
							category="utility"
							style={{fill: '#3bd308'}}
							name="check"
							size="x-small"
						/>
					</div>
				</div> */}
				{productType === 'Products' && subProducts.length > 0 &&
					<div className="slds-grid slds-m-top_x-small">
						<div className="slds-col slds-size_10-of-12">
							<div className="slds-text-title">Genoeg onderdelen?</div>
						</div>
						<div className="slds-col">
							<Icon
								assistiveText={{ label: partsIconInfo.label }}
								category="utility"
								style={{fill: partsIconInfo.color}}
								name={partsIconInfo.icon}
								size="x-small"
							/>
						</div>
					</div>
				}
			</div>
			<div className="slds-col slds-grid slds-wrap slds-size_11-of-12">
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
						onChange={updateQtyFromInput}
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
						deleteLine={deleteMe}
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
									onChange={e => {updateRemarks(e.target.value)}}
									value={remarks}
								>{remarks}</textarea>
							</Card>
						</div>
					</>
				}
			</div>
		</div>
	)
})

export default WorkAssignmentLine