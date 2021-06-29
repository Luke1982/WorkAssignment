import React, {useRef, useEffect, useState} from 'react'
import InputIcon from '@salesforce/design-system-react/components/icon/input-icon';

const ComboBoxComponent = ({options, onSelect}) => {
	const thisNode = useRef(null)
	const selectedOption = options.find(option => option.selected)

	const renderedOptions = options.map(option => {
		return (
			<li role="presentation" className="slds-listbox__item" data-value={option.value} key={option.value}>
				<div className="slds-listbox__option slds-listbox__option_plain" role="option">
					<span className="slds-media__body">
						<span className="slds-truncate" title={option.value}>{option.label}</span>
					</span>
				</div>
			</li>
		)
	})

	useEffect(() => {
		new ldsCombobox(thisNode.current , {
			onSelect
		})
	}, [])

	return(
		<div
			className="slds-combobox_container" ref={thisNode}>
			<div
				className="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-combobox-picklist"
				aria-expanded="false"
				aria-haspopup="listbox"
				role="combobox"
			>
				<div
					className="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right"
					role="none"
				>
					<input
						className="slds-input slds-combobox__input"
						aria-controls=""
						autoComplete="off"
						role="textbox"
						placeholder={selectedOption.label}
						readOnly="readonly"
						type="text"
						value={selectedOption.label}
					/>
					<InputIcon
							assistiveText={{
								icon: 'Maak een keuze',
							}}
							name="down"
							category="utility"
						/>
				</div>
				<div role="listbox">
					<ul
						className="slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid" 
						role="presentation">
						{renderedOptions}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default ComboBoxComponent