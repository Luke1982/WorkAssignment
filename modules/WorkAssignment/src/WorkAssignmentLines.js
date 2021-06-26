import React, {useState} from 'react'
import ReactDom from 'react-dom'
import IconSettings from '@salesforce/design-system-react/components/icon-settings'
import WorkAssignmentLine from './WorkAssignmentLine'
import {ReactSortable} from 'react-sortablejs'

export const WorkAssignmentLines = () => {
	const [lines, setLines] = useState([
		{},
		{},
		{}
	])
	return (
		<IconSettings iconPath='/include/LD/assets/icons'>
			<ReactSortable list={lines} setList={setLines}>
				{lines.map(line => {
					<WorkAssignmentLine />
				})}
			</ReactSortable>
		</IconSettings>
	)
}

ReactDom.render(
	<WorkAssignmentLines />,
	document.getElementById('workassignmentlines')
)