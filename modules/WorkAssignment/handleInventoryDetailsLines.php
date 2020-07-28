<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class handleInventoryDetailsLines extends VTEventHandler {
	public function handleEvent($eventName, $entityData) {
		// We don't check the modulename since this
		// event is limited to WorkAssignment already.
		global $log;
		$log->fatal("This handler has been called for the $name event and prints this message to the log file.");
	}
}