import React from 'react'
import ButtonGroup from '@salesforce/design-system-react/components/button-group';
import Button from '@salesforce/design-system-react/components/button';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown';
import Icon from '@salesforce/design-system-react/components/icon'
import DragAndDropIcon from '@salesforce/design-system-react/icons/utility/drag_and_drop'

const WorkAssignmentLineActions = () => {
	return (
		<ButtonGroup id="" className="slds-float_right">
			<Button
				assistiveText={{ icon: 'Verwijder deze rij' }}
				iconName="delete"
				iconVariant="border"
				variant="destructive"
				iconCategory="utility"
			/>
			<Dropdown
				assistiveText={{ icon: 'Settings' }}
				align="right"
				iconCategory="utility"
				iconName="settings"
				iconVariant="more"
				id="icon-dropdown-example-1"
				onSelect={(item) => {
					console.log(item.label, 'selected');
				}}
				openOn="click"
				options={[
					{ label: 'Maak rijen voor vereiste onderdelen', value: 'A0' },
					{ label: 'Maak rijen voor onderdelen en verwijder deze rij', value: 'B0' },
					{ label: 'Maak rijen voor optionele producten', value: 'B0' },
				]}
				value="A0"
				variant="icon"
			/>
			<Icon
				category="utility"
				className="linehandle slds-m-top_xx-small"
				icon={DragAndDropIcon}
				size="small"
				style={
					{"cursor": "move"}
				}

			/>
		</ButtonGroup>
	)
}

export default WorkAssignmentLineActions