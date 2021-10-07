<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class handleWorkAssignmentLines extends VTEventHandler {
	public function handleEvent($eventName, $entityData) {
		// We don't check the modulename since this
		// event is limited to WorkAssignment already.
		$lines = json_decode($_REQUEST['workassignmentlinestosave'], true);
		foreach ($lines as $line) {
			switch ($line['detailstype']) {
				case 'InventoryDetails':
					if (!isset($line['deleted']) || ($line['deleted'] !== true && $line['deleted'] !== 'true')) {
						self::saveNewLine($line, $entityData->getId());
					}
					break;
				case 'WorkAssignmentLine':
					if ($line['deleted'] === true || $line['deleted'] === 'true') {
						self::trashExistingLine($line);
					} else {
						self::saveExistingLine($line);
					}
					break;
			}
		}
	}

	private static function saveNewLine($line, $wa_id) {
		require_once 'modules/WorkAssignmentLines/WorkAssignmentLines.php';
		$wal = new WorkAssignmentLines();
		$wal->mode = 'create';

		$wal->column_fields['qty'] = $line['quantity'];
		$wal->column_fields['product'] = $line['productid'];
		$wal->column_fields['qtydelivered'] = $line['units_delivered_received'];
		$wal->column_fields['workshopstatus'] = $line['workshopstatus'];
		$wal->column_fields['workassignment'] = $wa_id;
		$wal->column_fields['originline'] = $line['inventorydetailsid'];
		$wal->column_fields['seq'] = $line['seq'];

		self::saveFocus($wal);
	}

	private static function saveExistingLine($line) {
		require_once 'modules/WorkAssignmentLines/WorkAssignmentLines.php';
		$wal = new WorkAssignmentLines();
		$wal->mode = 'edit';
		$wal->id = $line['id'];
		$wal->retrieve_entity_info($line['id'], 'WorkAssignmentLines');

		$wal->column_fields['qty'] = $line['quantity'];
		$wal->column_fields['product'] = $line['productid'];
		$wal->column_fields['qtydelivered'] = $line['units_delivered_received'];
		$wal->column_fields['workshopstatus'] = $line['workshopstatus'];
		$wal->column_fields['description'] = $line['description'];
		$wal->column_fields['seq'] = $line['seq'];

		self::saveFocus($wal);
	}

	private static function trashExistingLine($line) {
		require_once 'modules/WorkAssignmentLines/WorkAssignmentLines.php';
		$wal = new WorkAssignmentLines();
		$wal->id = $line['id'];
		$wal->trash('WorkAssignmentLines', $line['id']);
	}

	private static function saveFocus($focus) {
		global $current_user;
		$handler = vtws_getModuleHandlerFromName('WorkAssignmentLines', $current_user);
		$meta = $handler->getMeta();
		$focus->column_fields = DataTransform::sanitizeRetrieveEntityInfo($focus->column_fields, $meta);
		$focus->save('WorkAssignmentLines');
	}
}