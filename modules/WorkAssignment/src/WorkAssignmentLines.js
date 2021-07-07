import React, {useState, useRef, useEffect, createRef} from 'react'
import ReactDom from 'react-dom'
import IconSettings from '@salesforce/design-system-react/components/icon-settings'
import WorkAssignmentLine from './WorkAssignmentLine'
import {ReactSortable} from 'react-sortablejs'
import {getMode, getReturnId, api, getRecordId} from '../lib/js/utilities'

export const WorkAssignmentLines = () => {
	const thisNode = useRef(null)
	const lineRefs = useRef({})
	const [mode, setMode] = useState(getMode())
	const [lines, setLines] = useState([
		{
			id: 0,
		}
	])

	const deleteLine = (lineId, detailsType) => {
		if (detailsType === 'WorkAssignmentLine') {
			markForDeletion(lineId)
		} else if (detailsType === 'InventoryDetails') {
			unMarkForSave(lineId)
		}
	}

	const updateLineProperty = (id, prop, value) => {
		const newLines = lines.map(line => {
			if (line.id === id) {
				line[prop] = value
			}
			return line
		})
		setLines(newLines)
	}

	const writeLinesToDom = (linesArg = false) => {
		const domInput = document.getElementById('workassignmentlinestosave')
		domInput.value = JSON.stringify(linesArg ? linesArg : lines)
	}

	const renderedLines = lines.map(line => {
		const lineId = line.id === '0' ? line.inventorydetailsid : line.id
		return(
			<WorkAssignmentLine 
				key={lineId}
				id={lineId}
				seq={line.seq}
				quantity={line.quantity}
				productname={line.productname}
				delivered={line.units_delivered_received}
				description={line.description}
				productid={line.productid}
				producttype={line.lineproducttype}
				ref={lineRefs.current[lineId]}
				qtyinstock={line.qtyinstock}
				detailstype={line.detailstype}
				deleteLine={deleteLine}
				updateLineProp={updateLineProperty}
			/>
		)
	})

	const onDragEnd = e => {
		const newLines = lines.map(line => {
			const lineNodes = [...thisNode.current.ref.current.childNodes]
			const lineSeq = lineNodes.indexOf(lineRefs.current[line.id].current) + 1
			return Object.assign({}, line, {seq: lineSeq})
		})
		setLines(newLines)
	}

	const unMarkForSave = lineId => {
		const remainingLines = lines.filter(line => line.id !== lineId)
		setLines(remainingLines)
	}

	const getLines = () => {
		const getLinesAsync = async () => {
			switch (mode) {
				case 'conversion':
					var response = await fetch(`${api.loc}&function=getInventoryLines&sourcerecord=${getReturnId()}`)
					if (response.status !== 200) {
						ldsPrompt.show(
							'Niet gelukt regels te laden',
							'Het is niet gelukt om de regels van de verkooporder op te halen.'
						)
						return
					}
					var lines = await response.json()
					lines.forEach(line => {
						const lineId = line.id === '0' ? line.inventorydetailsid : line.id
						lineRefs.current[lineId] = lineRefs.current[lineId] ? lineRefs.current[lineId] : createRef()
					})
					setLines(lines)
					break
				case 'detailview':
				case 'edit':
					var response = await fetch(`${api.loc}&function=getLines&sourcerecord=${getRecordId()}`)
					if (response.status !== 200) {
						ldsPrompt.show(
							'Niet gelukt regels te laden',
							'Het is niet gelukt om de regels van de werkbon op te halen.'
						)
						return
					}
					var lines = await response.json()
					lines.forEach(line => {
						const lineId = line.id === '0' ? line.inventorydetailsid : line.id
						lineRefs.current[lineId] = lineRefs.current[lineId] ? lineRefs.current[lineId] : createRef()
					})
					setLines(lines)
					break
			}
		}
		getLinesAsync()
	}

	useEffect(getLines, [])

	useEffect(() => {
		writeLinesToDom()
	}, [lines])

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