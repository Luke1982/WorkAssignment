import React, {useEffect, useRef, useState} from 'react'

const ProductAutoCompleteComponent = ({onSelect}) => {

	const thisNode = useRef(null)
	const [val, setVal] = useState('')

	const onProductSelect = data => {
		setVal(data.result.meta.name)
		onSelect(data)
	}

	useEffect(() => {
		new window.ProductAutocomplete(thisNode.current, {}, onProductSelect)
	}, [])

	return(
		<div className="slds-form-element">
			<label className="slds-form-element__label" htmlFor="product">Product</label>
			<div className="slds-form-element__control">
				<div className="slds-combobox_container slds-has-inline-listbox cbds-product-search-component" ref={thisNode}>
					<div 
						className="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-combobox-lookup"
						aria-expanded="false"
						aria-haspopup="listbox"
						role="combobox">
						<div className="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right" role="none">
							<input
								id="test"
								name="test"
								className="slds-input slds-combobox__input cbds-inventoryline__input_name"
								aria-autocomplete="list"
								aria-controls="listbox-unique-id"
								autoComplete="off"
								role="textbox"
								placeholder="Type om te zoeken"
								value={val}
								onChange={e => {setVal(e.target.value)}}
								type="text"
							/>
							<span className="slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right">
								<svg className="slds-icon slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
									<use xlinkHref="include/LD/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
								</svg>
							</span>
							<div className="slds-input__icon-group slds-input__icon-group_right">
								<div role="status" className="slds-spinner slds-spinner_brand slds-spinner_x-small slds-input__spinner slds-hide">
									<span className="slds-assistive-text">Laden</span>
									<div className="slds-spinner__dot-a"></div>
									<div className="slds-spinner__dot-b"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductAutoCompleteComponent