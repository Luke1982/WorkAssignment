<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
 * Gets the existing inventorylines for a specific parent
 * ('master') ID. Orders by sequence no., joins on products
 * and services.
 *
 * @param Int The parent module ID
 * @param Bool A flag that should be true when these lines
 * 			   need to be duplicates (e.g. for converting
 * 			   from another module or duplication)
 *
 * @throws None
 * @author MajorLabel <info@majorlabel.nl>
 * @return Array $lines is an array that follows the model
 *               as can be seen in 'getSkeletonLine'. Field
 *               values are converted to user format.
 */
function getInventoryLines($id, $fornew = false) {
	global $adb, $current_user;
	$lines = array();
	$invlnesid_selector = $fornew ? '0' : 'id.inventorydetailsid';
	$q = "SELECT {$invlnesid_selector} AS 'inventorydetailsid',
					{$invlnesid_selector} AS id,
					CASE
						WHEN p.productname IS NULL THEN s.servicename
						ELSE p.productname
					END AS 'productname',
					id.productid AS 'productid',
					id.quantity AS 'quantity',
					c.description AS 'description',
					id.units_delivered_received AS 'units_delivered_received',
					id.total_stock AS 'total_stock',
					id.sequence_no AS seq,
					p.qtyinstock AS 'qtyinstock',
					p.qtyindemand AS 'qtyindemand',
					CASE
						WHEN p.productname IS NULL THEN s.service_usageunit
						ELSE p.usageunit
					END AS 'usageunit',
					CASE
						WHEN p.productname IS NULL THEN 'Services'
						ELSE 'Products'
					END AS 'lineproducttype',
					'--None--' AS 'workshopstatus',
					'InventoryDetails' AS detailstype
			FROM vtiger_inventorydetails AS id
			LEFT JOIN vtiger_products AS p ON id.productid = p.productid
			LEFT JOIN vtiger_service AS s ON id.productid = s.serviceid
			INNER JOIN vtiger_crmentity AS c ON id.inventorydetailsid = c.crmid
			WHERE c.deleted = 0
			AND id.related_to = {$id}
			ORDER BY id.sequence_no ASC";
	$r = $adb->query($q);
	foreach (rowGenerator($r) as $line) {
		$lines[] = $line;
	}
	return $lines;
}

/**
 * Gets the existing workassignmentlines for a specific parent
 * ('master') ID. Orders by sequence no., joins on products
 * and services.
 *
 * @param Int The parent module ID

 * @throws None
 * @author MajorLabel <info@majorlabel.nl>
 * @return Array $lines is an array that follows the model
 *               as can be seen in 'getSkeletonLine'. Field
 *               values are converted to user format.
 */
function getLines($id) {
	global $adb;
	$lines = array();
	$q = "SELECT workassignmentlinesid AS id,
					CASE
						WHEN p.productname IS NULL THEN s.servicename
						ELSE p.productname
					END AS 'productname',
					wal.product AS 'productid',
					wal.qty AS 'quantity',
					c.description AS 'description',
					wal.qtydelivered AS 'units_delivered_received',
					wal.seq AS seq,
					p.qtyinstock AS 'qtyinstock',
					p.qtyindemand AS 'qtyindemand',
					CASE
						WHEN p.productname IS NULL THEN s.service_usageunit
						ELSE p.usageunit
					END AS 'usageunit',
					CASE
						WHEN p.productname IS NULL THEN 'Services'
						ELSE 'Products'
					END AS 'lineproducttype',
					wal.workshopstatus AS 'workshopstatus',
					wal.workshoplocation AS 'workshoplocation',
					'WorkAssignmentLine' AS detailstype,
					'false' AS 'deleted'
			FROM vtiger_workassignmentlines AS wal
			LEFT JOIN vtiger_products AS p ON wal.product = p.productid
			LEFT JOIN vtiger_service AS s ON wal.product = s.serviceid
			INNER JOIN vtiger_crmentity AS c ON wal.workassignmentlinesid = c.crmid
			WHERE c.deleted = 0
			AND wal.workassignment = {$id}
			ORDER BY wal.seq ASC";
	$r = $adb->query($q);
	foreach (rowGenerator($r) as $line) {
		$lines[] = $line;
	}
	return $lines;
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
		case 'getInventoryLines':
			$productid = vtlib_purify($_REQUEST['sourcerecord']);
			$lines = $function($productid);
			header('Content-Type: application/json');
			echo json_encode($lines);
			break;
		case 'getLines':
			$productid = vtlib_purify($_REQUEST['sourcerecord']);
			$lines = $function($productid);
			header('Content-Type: application/json');
			echo json_encode($lines);
			break;
	}
}

handleIncomingWorkAssignmentRequests();