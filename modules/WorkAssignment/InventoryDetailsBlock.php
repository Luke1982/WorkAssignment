<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class InventoryDetailsBlock {
	public static function getWidget($name) {
		return (new InventoryDetailsBlock_RenderBlock());
	}
}

class InventoryDetailsBlock_RenderBlock extends InventoryDetailsBlock {

	private static $modname = '';
	private static $permitted_fields = array();
	private static $requested_bmfields = array();
	private static $selected_fields = array();
	private static $tax_blocks = array(
		'LBL_BLOCK_TAXES' => array(),
		'LBL_BLOCK_SH_TAXES' => array(),
	);
	private static $mod_info = array(
		'taxtype' => 'group',
		'aggr' => array(
			'grosstotal' => 0,
			'totaldiscount' => 0,
			'taxtotal' => 0,
			'subtotal' => 0,
			'total' => 0,
		),
		'grouptaxes' => array(),
		'shtaxes' => array(),
		'lines' => array(),
	);
	// These fields are always shown, no
	// matter what the system permissions
	// for this user are
	private static $always_active = array(
		'inventorydetails||quantity' => '',
		'inventorydetails||listprice' => '',
		'inventorydetails||extgross' => '',
		'inventorydetails||discount_amount' => '',
		'inventorydetails||inventorydetailsid' => '',
		'inventorydetails||description' => '',
		'inventorydetails||discount_type' => '',
		'inventorydetails||extnet' => '',
		'inventorydetails||linetotal' => '',
		'inventorydetails||description' => '',
		'products||productname' => '',
		'products||usageunit' => '',
	);

	public static function title() {
		return getTranslatedString('LBL_INVENTORYDETAILS_BLOCK', self::$modname);
	}

	private static function setModuleNameFromContext($context) {
		self::$modname = $context['MODULE']->value;
	}

	/**
	 * Get the parent (or 'master') module context and get relevant
	 * information for the block from it. Save that on the class
	 * property $mod_info
	 *
	 * @param Array $context  Context array about the parent
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return None
	 */
	private static function setModInfoFromContext($context) {
		require_once 'include/fields/CurrencyField.php';
		$fields = $context['FIELDS']->value;
		$taxes = self::getTaxes($context);
		list($tax_block_label, $shtax_block_label) = array_keys(self::$tax_blocks);

		self::$mod_info['taxtype'] = strtolower($fields['taxtype']);
		self::$mod_info['aggr']['pl_sh_total'] = $fields['pl_sh_total'];
		self::$mod_info['aggr']['shtaxtotal'] = $fields['pl_sh_tax'];
		self::$mod_info['aggr']['grosstotal'] = $fields['pl_gross_total'];
		self::$mod_info['aggr']['totaldiscount'] = $fields['pl_dto_total'];
		self::$mod_info['aggr']['pl_dto_line'] = $fields['pl_dto_line'];
		self::$mod_info['aggr']['pl_dto_global'] = $fields['pl_dto_global'];
		self::$mod_info['aggr']['taxtotal'] = $fields['sum_taxtotal'];
		self::$mod_info['aggr']['sum_nettotal'] = $fields['sum_nettotal'];
		self::$mod_info['aggr']['subtotal'] = $fields['pl_net_total'];
		self::$mod_info['aggr']['pl_adjustment'] = $fields['pl_adjustment'];
		self::$mod_info['aggr']['total'] = $fields['pl_grand_total'];
		self::$mod_info['grouptaxes'] = $taxes[$tax_block_label];
		self::$mod_info['shtaxes'] = $taxes[$shtax_block_label];

		foreach (self::$mod_info['aggr'] as &$aggr_field) {
			$aggr_field = CurrencyField::convertToUserFormat($aggr_field);
		}
	}

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
		// in $context['ID']
		// ini_set('display_errors', 1);
		// error_reporting(E_ALL);
		self::setModuleNameFromContext($context);
		self::getSelectedFields();
		self::setModInfoFromContext($context);
		self::$mod_info['lines'] = self::getLinesFromId((int)$context['ID']->value);
		$smarty = $this->setupRenderer();
		$smarty->assign('inventoryblock', self::$mod_info);
		return $smarty->fetch('modules/' . self::$modname . '/InventoryDetailsBlock.tpl');
	}

	/**
	 * Get the Smarty renderer and retrieves some language
	 * strings from both the global app as the module.
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Object Smarty instance with language arrays preloaded
	 */
	private function setupRenderer() {
		global $app_strings, $current_language;
		require_once 'Smarty_setup.php';
		$smarty = new vtigerCRM_Smarty();
		$smarty->assign('APP', $app_strings);
		$smarty->assign('MOD', return_module_language($current_language, self::$modname));
		return $smarty;
	}

	/**
	 * Get the array-representation of the businessmap
	 * for the parent (or 'master') module
	 *
	 * @param String The detail module you want to target
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array
	 */
	private static function getBusinessMapLayout($modname) {
		require_once 'modules/cbMap/cbMap.php';
		return cbMap::getMapByName(self::$modname . $modname)->MasterDetailLayout();
	}

	/**
	 * Gets a list of fields that is requested by a businessmap
	 * that has the name 'ParentModuleNameInventoryDetails'.
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array Array of fields where the key is a
	 *               contraction of lowercase 'inventorydetails',
	 *               two bars (||) and the fieldname so that
	 *               it follows the structure of the rest
	 *               of the functions.
	 */
	private static function getRequestedBmFields() {
		$idfields = self::getBusinessMapLayout('InventoryDetails')['detailview']['fieldnames'];
		$pfields = self::getBusinessMapLayout('Products')['detailview']['fieldnames'];
		$ret = array();
		foreach ($idfields as $fldname) {
			$ret['inventorydetails||' . $fldname] = $fldname;
		}
		foreach ($pfields as $fldname) {
			$ret['products||' . $fldname] = $fldname;
		}
		return $ret;
	}

	/**
	 * Gets the taxes that should be used on the parent ('master')
	 * module (so the aggregations block). This happends based
	 * on the mode we're in (create, edit, and so on)
	 *
	 * @param Array $context is the parent ('master') context
	 *              representation
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array Taxes from either the system or
	 *               the existing parent record.
	 */
	private static function getTaxes($context) {
		$mode = self::getMode();
		switch ($mode) {
			case 'create':
				return self::getAvailableTaxes();
				break;
			case 'detail':
			case 'edit':
				return self::getTaxesFromContext($context);
				break;
		}
	}

	/**
	 * Retrieve the current taxes (percentage and amount)
	 * for both regular and SH grouptaxes. These are the
	 * taxes that apply to the parent ('master') record,
	 * not the individual lines. These taxes come from
	 * existing parent records.
	 *
	 * @param Array $context  Context array about the parent
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array self::$tax_blocks  Array that uses the keys in
	 *                                  $tax_blocks and fills them with
	 *                                  tax information
	 */
	private static function getTaxesFromContext($context) {
		require_once 'include/fields/CurrencyField.php';

		$fields = $context['FIELDS']->value;
		self::$tax_blocks = self::getAvailableTaxes();
		list($tax_block_label, $shtax_block_label) = array_keys(self::$tax_blocks);

		foreach (self::$tax_blocks as $label => &$taxes) {
			$taxcount = count($taxes);
			$taxtype = $label == $tax_block_label ? 'tax' : 'shtax';
			for ($i = 0; $i < $taxcount; $i++) {
				$taxes[$i]['amount'] = CurrencyField::convertToUserFormat($fields[$taxtype . ($i + 1) . '_amount']);
				$taxes[$i]['percent'] = CurrencyField::convertToUserFormat($fields[$taxtype . ($i + 1) . '_perc']);
			}
		}
		return self::$tax_blocks;
	}

	/**
	 * Retrieve all the existing system taxes, both sales
	 * tax and shipping and handling tax.
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array $taxes  Array that uses the keys in
	 *                       $tax_blocks and fills them with
	 *                       tax information
	 */
	private static function getAvailableTaxes() {
		require_once 'include/utils/InventoryUtils.php';
		require_once 'include/fields/CurrencyField.php';
		$taxes = array('LBL_BLOCK_TAXES' => array(), 'LBL_BLOCK_SH_TAXES' => array());
		foreach (getAllTaxes('all', 'sh') as $shtax) {
			$taxes['LBL_BLOCK_SH_TAXES'][] = array(
				'amount' => 0,
				'percent' => CurrencyField::convertToUserFormat($shtax['percentage']),
				'taxlabel' => $shtax['taxlabel'],
				'taxname' => $shtax['taxname'],
			);
		}
		foreach (getAllTaxes() as $tax) {
			$taxes['LBL_BLOCK_TAXES'][] = array(
				'amount' => 0,
				'percent' => CurrencyField::convertToUserFormat($tax['percentage']),
				'taxlabel' => $tax['taxlabel'],
				'taxname' => $tax['taxname'],
			);
		}
		return $taxes;
	}

	/**
	 * Get the mode the parent ('master') record is in
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return String $mode represents the mode
	 */
	private static function getMode() {
		$mode = '';
		if ($_REQUEST['action'] == 'EditView' && !isset($_REQUEST['record'])) {
			$mode = 'create';
		} elseif ($_REQUEST['action'] == 'EditView' && isset($_REQUEST['record'])) {
			$mode = 'edit';
		} elseif ($_REQUEST['action'] == 'EditView' && $_REQUEST['isDuplicate'] == 'true') {
			$mode = 'duplication';
		} elseif ($_REQUEST['action'] == 'DetailView') {
			$mode = 'detail';
		}
		return $mode;
	}

	/**
	 * Check if the parent ('master') has any InventoryDetails
	 * records associated with it. No records should mean we're
	 * creating a new record.
	 *
	 * @param Int The crmid of the parent ('master') record
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Bool true is underlying lines are there, false if
	 *              there are no underlying records.
	 */
	private static function hasInventoryLines($id) {
		global $adb;
		$r = $adb->query("SELECT COUNT(*) AS cnt FROM `vtiger_inventorydetails` WHERE related_to = {$id}");
		return (int)$adb->query_result($r, 0, 'cnt') !== 0;
	}

	/**
	 * Gets either the existing lines that reference this
	 * parent ('master') record, or sets up an empty startline
	 * when the parent is in createmode.
	 *
	 * @param Int $id  crmid of the parent ('master')
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array Array of lines
	 */
	private static function getLinesFromId($id) {
		if (self::hasInventoryLines($id)) {
			// Get existing lines
			return self::getInventoryLines($id);
		} else {
			return array(
				self::getSkeletonLine()
			);
		}
	}

	/**
	 * Gets all the selected fields. Those are:
	 * - The 'fixed' always active fields
	 * - The fields selected through a business
	 *   map, but only if the user is allowed
	 *   to see those.
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return None
	 */
	private static function getSelectedFields() {
		$permitted_ids = self::getPermittedFieldsFor('InventoryDetails');
		$permitted_prod = self::getPermittedFieldsFor('Products');
		self::$permitted_fields = array_merge(self::$always_active, $permitted_ids, $permitted_prod);
		self::$requested_bmfields = self::getRequestedBmFields();
		foreach (self::$permitted_fields as $fldname => $fld) {
			if (array_key_exists($fldname, self::$requested_bmfields)
			   || array_key_exists($fldname, self::$always_active)
			) {
				self::$selected_fields[$fldname] = $fld;
			}
		}
	}

	/**
	 * Gets all the fields a user is permitted to see
	 * for a specific modulename
	 *
	 * @param String The module name
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array Array of fields where the key
	 *               is a contraction of the lowercase
	 *               modulename, two bars (||) and the
	 *               fieldname. Value is the fieldinfo
	 */
	private static function getPermittedFieldsFor($modname) {
		global $current_user, $adb, $log;
		$ret = array();
		$webserviceObject = VtigerWebserviceObject::fromName($adb, $modname);
		$handlerPath = $webserviceObject->getHandlerPath();
		$handlerClass = $webserviceObject->getHandlerClass();
		require_once $handlerPath;
		$handler = new $handlerClass($webserviceObject, $current_user, $adb, $log);
		$fields = $handler->describe($modname)['fields'];

		foreach ($fields as $field) {
			$ret[strtolower($modname) . '||' . $field['name']] = $field;
		}
		return $ret;
	}

	/**
	 * Gets the existing inventorylines for a specific parent
	 * ('master') ID. Orders by sequence no., joins on products
	 * and (soon) services.
	 *
	 * @param Int The parent module ID
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array $lines is an array that follows the model
	 *               as can be seen in 'getSkeletonLine'. Field
	 *               values are converted to user format.
	 */
	private static function getInventoryLines($id) {
		require_once 'include/fields/CurrencyField.php';
		global $adb, $current_user;
		$skeleton = self::getSkeletonLine();
		$lines = array();
		$taxquery = '';
		for ($i = 1; $i <= count($skeleton['taxes']); $i++) {
			$taxquery .= "id.id_tax{$i}_perc AS 'inventorydetails||id_tax{$i}_perc',";
		}
		$q = "SELECT id.inventorydetailsid AS 'inventorydetails||inventorydetailsid',
					 p.productname AS 'products||productname',
					 id.productid AS 'inventorydetails||productid',
					 id.quantity AS 'inventorydetails||quantity',
					 CASE
					 	WHEN id.discount_percent > 0 THEN 'p'
						ELSE 'd'
					 END AS 'inventorydetails||discount_type',
					 id.discount_amount AS 'inventorydetails||discount_amount',
					 id.discount_percent AS 'inventorydetails||discount_percent',
					 id.linetotal AS 'inventorydetails||linetotal',
					 p.divisible AS 'products||divisible',
					 c.description AS 'inventorydetails||description',
					 id.cost_price AS 'inventorydetails||cost_price',
					 id.cost_gross AS 'inventorydetails||cost_gross',
					 id.listprice AS 'inventorydetails||listprice',
					 id.extgross AS 'inventorydetails||extgross',
					 id.extnet AS 'inventorydetails||extnet',
					 id.units_delivered_received AS 'inventorydetails||units_delivered_received',
					 id.total_stock AS 'inventorydetails||total_stock',
					 {$taxquery}
					 p.qtyinstock AS 'products||qtyinstock',
					 p.qtyindemand AS 'products||qtyindemand',
					 p.usageunit AS 'products||usageunit'
			  FROM vtiger_inventorydetails AS id
			  LEFT JOIN vtiger_products AS p ON id.productid = p.productid
			  INNER JOIN vtiger_crmentity AS c ON id.inventorydetailsid = c.crmid
			  WHERE c.deleted = 0
			  AND id.related_to = {$id}
			  ORDER BY id.sequence_no ASC";
		$r = $adb->query($q);

		while ($line = $adb->fetch_array($r)) {
			$newskel = $skeleton;

			$newskel['meta'] = self::getFieldsForGroup($line, $newskel, 'meta');
			$newskel['pricing'] = self::getFieldsForGroup($line, $newskel, 'pricing');
			$newskel['logistics'] = self::getFieldsForGroup($line, $newskel, 'logistics');

			foreach ($newskel['taxes'] as &$tax) {
				$tax['percent'] = CurrencyField::convertToUserFormat($line['inventorydetails||id_' . $tax['taxname'] . '_perc'], $current_user);
			}
			$lines[] = $newskel;
		}
		return $lines;
	}

	/**
	 * Helper that takes a 'group' from the skeleton
	 * line (like 'logistics') and fills it with the
	 * data, only if the fieldname is present in the
	 * skeleton model for that group and if the field
	 * is selected (which can only happen through
	 * businessmaps and field permissions)
	 *
	 * @param Array  The line as retrieved from the
	 *               database in 'getInventoryLines'
	 * @param Array  The skeleton copy we're filling
	 *               with the retrieved line
	 * @param String The groupname (i.e. 'logistics')
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array The skeleton group filled with
	 *               formatted fielddata
	 */
	private static function getFieldsForGroup($line, $skeleton, $group) {
		foreach ($line as $modandcolumnname => $grp) {
			if (!is_int($modandcolumnname)) {
				list($modname, $columnname) = explode('||', $modandcolumnname);
				if (array_key_exists($modandcolumnname, self::$selected_fields) &&
					array_key_exists($columnname, $skeleton[$group])
				) {
					$skeleton[$group][$columnname] = self::getFielddataFromLine($modandcolumnname, $line);
				} elseif (!array_key_exists($modandcolumnname, self::$selected_fields) &&
						  array_key_exists($columnname, $skeleton[$group])
				) {
					unset($skeleton[$group][$columnname]);
				}
			}
		}
		return $skeleton[$group];
	}

	/**
	 * Formats the field when necessary
	 *
	 * @param String The contraction of lowercase modname,
	 *               two bars (||) and the columnname
	 * @param Array  The line as retrieved from the database
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return String The formatted field value
	 */
	private static function getFielddataFromLine($modandcolumnname, &$line) {
		require_once 'include/fields/CurrencyField.php';
		global $current_user;
		$retval = '';
		$flddata = &self::$permitted_fields[$modandcolumnname];
		if ($flddata != '') {
			switch ($flddata['uitype']) {
				case '7':
				case '71':
				case '9':
					$retval = CurrencyField::convertToUserFormat($line[$modandcolumnname], $current_user);
					break;
				default:
					$retval = $line[$modandcolumnname];
					break;
			}
		}
		return $retval;
	}

	/**
	 * Gets an empty skeleton line. Also serves as documentation
	 * on how the line is structured. Will be used as the first
	 * empty line when no previous lines were there (e.g., the
	 * parent/master record is in createmode).
	 *
	 * The 'custom' arraykey should be filled by fields as
	 * defined in the MasterDetail businessmap for the parent
	 * ('master') record that targets InventoryDetails
	 *
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array Empty skeleton line
	 */
	private static function getSkeletonLine() {
		return array(
			'meta' => array(
				'inventorydetailsid' => 0,
				'image' => '',
				'productname' => '',
				'productid' => 0,
				'quantity' => 1,
				'discount_type' => 'p',
				'discount_amount' => 0,
				'discount_percent' => 0,
				'linetotal' => 0,
				'divisible' => true,
				'description' => '',
			),
			'pricing' => array(
				'cost_price' => 0,
				'cost_gross' => 0,
				'listprice' => 0,
				'extgross' => 0,
				'extnet' => 0,
			),
			'logistics' => array(
				'units_delivered_received' => 0,
				'qtyinstock' => 0,
				'total_stock' => 0,
				'qtyindemand' => 0,
				'usageunit' => '',
			),
			'taxes' => self::getAvailableTaxes()['LBL_BLOCK_TAXES'],
			'custom' => array(
				// Filled by the MasterDetail mapping's 'fields' directive
			),
		);
	}
}