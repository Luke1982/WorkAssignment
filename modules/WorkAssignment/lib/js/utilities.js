export const getMode = () => {
	let mode = ''
	const returnModuleInput = document.getElementsByName('return_module')[0]
	const recordInput = document.getElementsByName('record')[0]
	if (document.EditView
		&& recordInput.value === ''
		&& returnModuleInput.value === '')
	{
		mode = 'create'
	} else if (document.EditView
		&& returnModuleInput.value !== '')
	{
		mode = 'conversion'
	}
	return mode
}

export const getReturnId = () => {
	return document.getElementsByName('return_id')[0].value
}

export const api = {
	loc: 'index.php?action=WorkAssignmentAjax&module=WorkAssignment&file=WorkAssignmentAPI'
}