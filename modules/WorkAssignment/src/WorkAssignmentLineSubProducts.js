import React from 'react'

import Card from '@salesforce/design-system-react/components/card';
import DataTable from '@salesforce/design-system-react/components/data-table';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import Icon from '@salesforce/design-system-react/components/icon';

const WorkAssignmentLineSubProducts = ({parts}) => {
	return (
		<div className="slds-grid slds-grid_vertical slds-m-top_small">
			<Card
				heading="Onderdelen"
				icon={<Icon category="standard" name="strategy" size="small" />}
			>
				{parts.length > 0 &&
					<DataTable items={parts} fixedLayout>
						<DataTableColumn 
							label="Product"
							property="productname"
							truncate={true}
							width="70%"
						/>
						<DataTableColumn 
							label="Nodig"
							property="quantity"
							width="15%"
						/>
						<DataTableColumn 
							label="Voorraad"
							property="qtyinstock"
							width="15%"
						/>
					</DataTable>
				}
			</Card>
		</div>
	)
}

export default WorkAssignmentLineSubProducts