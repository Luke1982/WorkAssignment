<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class WorkAssignmentLinesBlock {
	public static function getWidget($name) {
		return (new WorkAssignmentLinesBlock_RenderBlock());
	}
}

class WorkAssignmentLinesBlock_RenderBlock extends WorkAssignmentLinesBlock {

	/**
	 * Interface implementation method that should return
	 * the HTML rendered on screen
	 *
	 * @param Array $context  Context array about the parent
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return String HTML that renders on screen
	 */
	public function process($context = false) {
		// $context contains the WorkAssignment ID
		$test = array(
			'lines' => array(
				array(
					'seq' => 12,
					'crmid' => 23094,
					'productid' => 2312,
					'preparationstatus' => 'Not yet prepared',
				),
			),
		);
		// echo '<input type="hidden" id="workassignmentlineinfo" value=\'' . json_encode($test) . '\' />';
		echo '<div id="workassignmentlines"></div>';
		echo '<script src="/include/js/Inventory.js"></script>';
		echo '<script src="/modules/WorkAssignment/dist/bundle.js"></script>';
	}
}