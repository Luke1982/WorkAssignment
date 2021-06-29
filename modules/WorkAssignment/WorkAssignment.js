function WorkAssignmentsetValueFromCapture(recordid,value,target_fieldname) {
	if (typeof window.currentWorkAssignmentAssetSelector === 'function') {
		window.currentWorkAssignmentAssetSelector(recordid,value,target_fieldname)
	}
}