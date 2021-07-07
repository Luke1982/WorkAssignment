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
		&& returnModuleInput.value !== ''
		&& recordInput.value === '')
	{
		mode = 'conversion'
	} else if (document.DetailView)
	{
		mode = 'detailview'
	} else if (document.EditView
		&& recordInput.value !== '')
	{
		mode = 'edit'
	}
	return mode
}

export const getReturnId = () => {
	return document.getElementsByName('return_id')[0].value
}

export const getRecordId = () => {
	return document.getElementsByName('record')[0].value
}

export const getSoId = () => {
	return document.getElementsByName('salesorder')[0].value
}

export const api = {
	loc: 'index.php?action=WorkAssignmentAjax&module=WorkAssignment&file=WorkAssignmentAPI'
}