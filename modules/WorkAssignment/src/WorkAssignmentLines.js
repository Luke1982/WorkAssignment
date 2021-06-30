import React, {useState, useRef} from 'react'
import ReactDom from 'react-dom'
import IconSettings from '@salesforce/design-system-react/components/icon-settings'
import WorkAssignmentLine from './WorkAssignmentLine'
import {ReactSortable} from 'react-sortablejs'

export const WorkAssignmentLines = () => {
	const thisNode = useRef(null)
	const [lines, setLines] = useState([
		{
			id: 1,
			ref: useRef(null),
			seq: 1
		},
		{
			id: 2,
			ref: useRef(null),
			seq: 2
		},
		{
			id: 3,
			ref: useRef(null),
			seq: 3
		}
	])

	const renderedLines = lines.map(line => {
		return(
			<WorkAssignmentLine
				key={line.id}
				id={line.id}
				ref={line.ref}
			/>
		)
	})

	const onDragEnd = e => {
		const newLines = lines.map(line => {
			const lineNodes = [...thisNode.current.ref.current.childNodes]
			const lineSeq = lineNodes.indexOf(line.ref.current) + 1
			return Object.assign({}, line, {seq: lineSeq})
		})
		setLines(newLines)
	}

	return (
		<ReactSortable
			list={lines}
			setList={setLines}
			animation={200}
			handle=".linehandle"
			onEnd={onDragEnd}
			ref={thisNode}
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