import React, { useState, useRef, useEffect, createRef } from 'react'
import ReactDom, { render } from 'react-dom'
import IconSettings from '@salesforce/design-system-react/components/icon-settings'
import WorkAssignmentLine from './WorkAssignmentLine'
import { ReactSortable } from 'react-sortablejs'
import { getMode, getReturnId, api, getRecordId, getSoId } from '../lib/js/utilities'
import Button from '@salesforce/design-system-react/components/button';

export const WorkAssignmentLines = () => {
	const thisNode = useRef(null)
	const lineRefs = useRef({})
	const [mode, setMode] = useState(getMode())
	const [lines, setLines] = useState([])
	const [candidateLines, setCandidateLines] = useState([])
	const [candidatesExpanded, setCandidatesExpanded] = useState(false)

	const deleteLine = (lineId, detailsType, currentSeq) => {
		if (detailsType === 'WorkAssignmentLine') {
			markForDeletion(lineId, currentSeq)
		} else if (detailsType === 'InventoryDetails') {
			unMarkForSave(lineId, currentSeq)
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

	const convertCandidate = id => {
		const lineToConvert = candidateLines.find(line => line.id === id)
		lineToConvert.seq = lines.length + 1
		lineToConvert.originline = id
		const newCandidateLines = candidateLines.filter(line => line.id !== id)
		const newLines = [...lines]
		newLines.push(lineToConvert)
		setLines(newLines)
		setCandidateLines(newCandidateLines)
	}

	const renderedLines = lines.map(line => {
		const lineId = line.id === '0' ? line.inventorydetailsid : line.id
		return (
			<React.Fragment key={lineId}>
				{line.deleted !== true &&
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
				}
			</React.Fragment>
		)
	})

	const renderedCandidateLines = candidateLines.map(line => {
		const lineId = line.id === '0' ? line.inventorydetailsid : line.id
		return (
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
				conceptstatus={line.conceptstatus}
				convertCandidate={convertCandidate}
			/>
		)
	})

	const updateSeq = () => {
		const newLines = lines.map(line => {
			const lineNodes = [...thisNode.current.ref.current.childNodes]
			const lineSeq = lineNodes.indexOf(lineRefs.current[line.id].current) + 1
			return Object.assign({}, line, { seq: lineSeq })
		})
		setLines(newLines)
	}

	const unMarkForSave = (lineId, currentSeq) => {
		const remainingLines = lines.map(line => {
			if (Number(line.id) !== Number(lineId)) {
				if (Number(line.seq) > Number(currentSeq)) {
					line.seq = Number(line.seq) - 1
				}
				return line
			} else {
				line.deleted = true
				return line
			}
		})
		setLines(remainingLines)
	}

	const markForDeletion = (lineId, currentSeq) => {
		const newLines = lines.map(line => {
			if (line.id === lineId) {
				line.deleted = true
				line.seq = 0
			}
			if (Number(line.seq) > Number(currentSeq)) {
				line.seq = Number(line.seq) - 1
			}
			return line
		})
		setLines(newLines)
	}

	useEffect(() => {
		writeLinesToDom()
	}, [lines])

	const fetchLines = async (func, source, promptHead, promptText) => {
		const response = await fetch(`${api.loc}&function=${func}&sourcerecord=${source}`)
		if (response.status !== 200) {
			ldsPrompt.show(promptHead,promptText)
			return
		}
		const lines = await response.json()
		lines.forEach(line => {
			const lineId = line.id === '0' ? line.inventorydetailsid : line.id
			lineRefs.current[lineId] = lineRefs.current[lineId] ? lineRefs.current[lineId] : createRef()
		})
		return lines
	}

	const getLines = () => {
		const getLinesAsync = async () => {
			switch (mode) {
				case 'conversion':
					var lines = await fetchLines(
						'getInventoryLines',
						getReturnId(),
						'Niet gelukt regels te laden',
						'Het is niet gelukt om de regels van de verkooporder op te halen.'
						)
					setLines(lines)
					break
				case 'detailview':
				case 'edit':
					var lines = await fetchLines(
						'getLines',
						getRecordId(),
						'Niet gelukt regels te laden',
						'Het is niet gelukt om de regels van de werkbon op te halen.'
						)
					const candidateLines = await fetchLines(
						'getCandidateLines',
						getSoId(),
						'Niet gelukt kandidaatregels te laden',
						'Het is niet gelukt om de kandidaatregels van de order op te halen.'
					)
					setCandidateLines(candidateLines)
					setLines(lines)
					break
			}
		}
		getLinesAsync()
	}

	useEffect(getLines, [])

	return (
		<>
			{mode !== 'detailview' && renderedLines.length > 0 &&
				<ReactSortable
					list={lines}
					setList={setLines}
					animation={200}
					handle=".linehandle"
					onEnd={updateSeq}
					ref={thisNode}
				>
					<IconSettings iconPath='/include/LD/assets/icons'>
						{renderedLines}
					</IconSettings>
				</ReactSortable>
			}
			{mode === 'detailview' && renderedLines.length > 0 &&
				<IconSettings iconPath='/include/LD/assets/icons'>
					{renderedLines}
				</IconSettings>
			}
			{renderedLines.length === 0 &&
				<div style={{'height':'6rem', 'position':'relative'}}>
					<div className="slds-spinner_container">
						<div role="status" className="slds-spinner slds-spinner_medium slds-spinner_brand">
							<span className="slds-assistive-text">Loading</span>
							<div className="slds-spinner__dot-a"></div>
							<div className="slds-spinner__dot-b"></div>
						</div>
					</div>
				</div>
			}
			{candidateLines.length > 0 && mode !== 'detailview' &&
				<IconSettings iconPath='/include/LD/assets/icons'>
					<div className="slds-box slds-theme_warning slds-theme_alert-texture">
						<Button
							assistiveText={{ icon: 'Klap deze rij in of uit' }}
							iconName={candidatesExpanded ? 'collapse_all' : 'expand_all'}
							iconVariant="border"
							iconCategory="utility"
							style={{backgroundColor: '#ffffff'}}
							onClick={() => setCandidatesExpanded(!candidatesExpanded)}
							className="slds-float_right"
						/>
						<div className="slds-text-heading_small slds-text-align_center slds-m-bottom_medium">Kandidaat regels</div>
						{candidatesExpanded && 
							renderedCandidateLines
						}
					</div>
				</IconSettings>
			}
		</>
	)
}

ReactDom.render(
	<WorkAssignmentLines />,
	document.getElementById('workassignmentlines')
)