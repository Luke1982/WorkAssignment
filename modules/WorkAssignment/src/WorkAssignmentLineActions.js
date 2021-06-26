import React from 'react'
import ButtonGroup from '@salesforce/design-system-react/components/button-group';
import Button from '@salesforce/design-system-react/components/button';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown';

const WorkAssignmentLineActions = () => {
	return (
		<ButtonGroup id="" className="slds-float_right">
			<Button
				assistiveText={{ icon: 'Verplaats volgorde' }}
				buttonVariant="icon"
				iconName="drag_and_drop"
				iconVariant="border"
				variant="icon"
			/>
			<Button
				assistiveText={{ icon: 'Verwijder deze rij' }}
				iconName="delete"
				iconVariant="border"
				variant="destructive"
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
					{ label: 'Doe iets met deze rij', value: 'A0' },
					{ label: 'Doe iets anders met deze rij', value: 'B0' },
				]}
				value="A0"
				variant="icon"
			/>
		</ButtonGroup>
	)
}

export default WorkAssignmentLineActions