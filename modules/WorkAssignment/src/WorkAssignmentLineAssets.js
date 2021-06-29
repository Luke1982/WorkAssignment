import React, {useState} from 'react'

import Button from '@salesforce/design-system-react/components/button'; 
import Card from '@salesforce/design-system-react/components/card';
import CardEmpty from '@salesforce/design-system-react/components/card/empty';
import CardFilter from '@salesforce/design-system-react/components/card/filter';
import DataTable from '@salesforce/design-system-react/components/data-table';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import Icon from '@salesforce/design-system-react/components/icon';

const WorkAssignmentLineAssets = () => {
	const defaultItems = [
		
	]

	const openAssetCapture = () => {
		const accId = document.getElementsByName('account_id')[0].value
		if (accId === '') {
			ldsPrompt.show('Fout', 'Kies eerst een klant voor je activa gaat koppelen')
			return
		}
		var searchConditions = [
			{"groupid":"1",
			 "columnname":"vtiger_assets:account:account:Assets_Customer_name:I",
			 "comparator":"e",
			 "value": accId,
			 "columncondition":""}
		];
		var advSearch = '&query=true&searchtype=advance&advft_criteria='+convertArrayOfJsonObjectsToString(searchConditions);
		var SpecialSearch = encodeURI(advSearch);
		window.open(
			`index.php?
				module=Assets&
				action=Popup&
				html=Popup_picker&
				form=vtlibPopupView&
				srcmodule=WorkAssignment&
				forrecord=${0}&
				forfield=DontCare
				${SpecialSearch}`,
			"vtlibui10",
			"width=680,height=602,resizable=0,scrollbars=0,top=150,left=200"
		)
	}

	const [items, setItems] = useState(defaultItems)
	const [isFiltering, setIsFiltering] = useState(false)

	const handleFilterChange = (event) => {
		const filteredItems = items.filter((item) =>
			RegExp(event.target.value, 'i').test(item.assetname)
		);
		setIsFiltering(true)
		setItems(filteredItems.length === 0 ? defaultItems : filteredItems)
	};

	const handleDeleteAllItems = () => {

		this.setState({ isFiltering: false, items: [] });
	};

	const handleAddItem = () => {
		setItems(items)
	};

	const isEmpty = items.length === 0;

	return (
		<div className="slds-grid slds-grid_vertical slds-m-top_small">
			<Card
				filter={
					(!isEmpty || isFiltering) && (
						<CardFilter onChange={handleFilterChange} />
					)
				}
				headerActions={
					!isEmpty && (
						<Button
							label="Delete All Items"
							onClick={handleDeleteAllItems}
						/>
					)
				}
				heading="Activa"
				icon={<Icon category="standard" name="asset_relationship" size="small" />}
				empty={
					isEmpty ? (
						<CardEmpty heading="Nog geen activa gekoppeld">
							<Button label="Koppel activa" onClick={openAssetCapture} />
						</CardEmpty>
					) : null
				}
			>
				<DataTable items={items}>
					<DataTableColumn
						label="Activa naam"
						property="assetname"
						truncate
					/>
					<DataTableColumn
						label="Serienummer"
						property="serial_number"
						truncate
					/>
				</DataTable>
			</Card>
		</div>
	)
}

export default WorkAssignmentLineAssets