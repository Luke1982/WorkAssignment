import React from 'react'

import Button from '@salesforce/design-system-react/components/button'; 
import Card from '@salesforce/design-system-react/components/card';
import DataTable from '@salesforce/design-system-react/components/data-table';
import DataTableCell from '@salesforce/design-system-react/components/data-table/cell';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import Icon from '@salesforce/design-system-react/components/icon';

const WorkAssignmentLineAssets = ({setAssets, assets}) => {
	const whenAssetSelected = (recordid, value, target_fieldname) => {
		assets.push({
			classNameRow: `asset-row-id-${recordid.toString()}`,
			id: recordid.toString(),
			assetname: value
		})
		setAssets([...assets])
		window.currentWorkAssignmentAssetSelector = undefined
	}

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
		window.currentWorkAssignmentAssetSelector = whenAssetSelected
	}

	const removeAssetRelation = e => {
		const tr = e.target.parentElement.parentElement.parentElement
		const assetid = tr.className.match(/asset-row-id-([0-9]{1,})/)[1]
		const newAssets = assets.filter(asset => {
			return asset.id !== assetid
		})
		setAssets(newAssets)
	}

	const TrashDataTableCell = ({ children, ...props }) => (
	<DataTableCell {...props}>
		<Button
			assistiveText={{ icon: 'Verwijder activa' }}
			iconCategory="utility"
			iconName="delete"
			iconSize="x-small"
			iconVariant="bare"
			onClick={(e) => {
				removeAssetRelation(e)
			}}
			variant="icon"
		/>
	</DataTableCell>
	);
	TrashDataTableCell.displayName = DataTableCell.displayName;

	return (
		<div className="slds-grid slds-grid_vertical slds-m-top_small">
			<Card
				headerActions={
					<Button
						label="Kies activa"
						onClick={openAssetCapture}
					/>
				}
				heading="Activa"
				icon={<Icon category="standard" name="asset_relationship" size="small" />}
			>
				{assets.length > 0 &&
					<DataTable items={assets}>
						<DataTableColumn 
							label="Activa naam"
							property="assetname"
						/>
						<DataTableColumn>
							<TrashDataTableCell />
						</DataTableColumn>
					</DataTable>
				}
			</Card>
		</div>
	)
}

export default WorkAssignmentLineAssets