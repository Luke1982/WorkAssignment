import React, {useState} from 'react'
import ReactDom from 'react-dom'
import IconSettings from '@salesforce/design-system-react/components/icon-settings'
import WorkAssignmentLine from './WorkAssignmentLine'
import {ReactSortable} from 'react-sortablejs'

export const WorkAssignmentLines = () => {
	const [lines, setLines] = useState([
		{id: 1},
		{id: 2},
		{id: 3}
	])

	const renderedLines = lines.map(line => {
		return <WorkAssignmentLine key={line.id} />
	})
	return (
		<ReactSortable
			list={lines}
			setList={setLines}
			animation={200}
			handle=".linehandle"
		>
			<IconSettings iconPath='/include/LD/assets/icons'>
				{renderedLines}
			</IconSettings>
		</ReactSortable>
	)
}

ReactDom.render(
	<WorkAssignmentLines />,
	document.getElementById('workassignmentlines')
)