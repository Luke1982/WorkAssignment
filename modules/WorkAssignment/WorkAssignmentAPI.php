<?php

/**
 * Get the parts for a given product
 *
 * @param Int $productid
 *
 * @throws None
 * @author MajorLabel <info@majorlabel.nl>
 * @return Array
 */
function getPartsForProduct($productid) {
	global $adb, $current_user;
	require_once 'include/fields/CurrencyField.php';
	$q = "SELECT p.productname,
				 p.productid AS id,
				 p.qtyinstock,
				 pc.quantity
		FROM vtiger_products AS p
		INNER JOIN vtiger_productcomponent AS pc ON p.productid = pc.topdo
		INNER JOIN vtiger_crmentity AS e ON pc.productcomponentid = e.crmid
		WHERE pc.frompdo = ?
		AND pc.relmode = ?
		AND e.deleted = ?";
	$r = $adb->pquery($q, array($productid, 'Required', 0));
	$return_array = array();
	foreach (rowGenerator($r) as $row) {
		$row['quantity'] = CurrencyField::convertToUserFormat($row['quantity'], $current_user, true);
		$row['qtyinstock'] = CurrencyField::convertToUserFormat($row['qtyinstock'], $current_user, true);
		$return_array[] = $row;
	}
	return $return_array;
}

/**
 * Create a row generator to loop database results
 *
 * @param Object $r (result)
 *
 * @throws None
 * @author MajorLabel <info@majorlabel.nl>
 * @return Array
 */
function rowGenerator($r) {
	global $adb;
	while ($row = $adb->fetch_array($r)) {
		yield $row;
	}
}

/**
 * Handle incoming requests
 *
 * @throws None
 * @author MajorLabel <info@majorlabel.nl>
 * @return None
 */
function handleIncomingWorkAssignmentRequests() {
	$function = vtlib_purify($_REQUEST['function']);
	switch ($function) {
		case 'getPartsForProduct':
			$productid = vtlib_purify($_REQUEST['productid']);
			$parts = $function($productid);
			header('Content-Type: application/json');
			echo json_encode($parts);
			break;
	}
}

handleIncomingWorkAssignmentRequests();