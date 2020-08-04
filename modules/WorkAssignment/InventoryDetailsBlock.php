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
		self::setModuleNameFromContext($context);
		self::setModInfoFromContext($context);
		self::$mod_info['lines'] = self::getLinesFromId((int)$context['ID']->value);
		$smarty = $this->setupRenderer();
		$smarty->assign('inventoryblock', self::$mod_info);
		$smarty->assign('context', $context);
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
		global $app_strings;
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
	 * @param None
	 *
	 * @throws None
	 * @author MajorLabel <info@majorlabel.nl>
	 * @return Array
	 */
	private static function getBusinessMapLayout() {
		require_once 'modules/cbMap/cbMap.php';
		return cbMap::getMapByName(self::$modname . 'InventoryDetails')->MasterDetailLayout();
	}

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
	 * not the individual lines
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

	private static function getAvailableTaxes() {
		require_once 'include/utils/InventoryUtils.php';
		require_once 'include/fields/CurrencyField.php';
		$taxes = array('LBL_BLOCK_TAXES' => array(), 'LBL_BLOCK_SH_TAXES' => array());
		foreach (getAllTaxes('all', 'sh') as $shtax) {
			$taxes['LBL_BLOCK_TAXES'][] = array(
				'amount' => 0,
				'percent' => CurrencyField::convertToUserFormat($shtax['percentage']),
				'taxlabel' => $shtax['taxlabel'],
				'taxname' => $shtax['taxname'],
			);
		}
		foreach (getAllTaxes() as $tax) {
			$taxes['LBL_BLOCK_SH_TAXES'][] = array(
				'amount' => 0,
				'percent' => CurrencyField::convertToUserFormat($tax['percentage']),
				'taxlabel' => $tax['taxlabel'],
				'taxname' => $tax['taxname'],
			);
		}
		return $taxes;
	}

	private static function getTaxBlockLabels() {
		list($tax_block_label, $shtax_block_label) = array_keys(self::$tax_blocks);
		return array(
			'tax' => $tax_block_label,
			'shtax' => $shtax_block_label,
		);
	}

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
		} else {
			return array(
				self::getSkeletonLine()
			);
		}
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
				'crmid' => 0,
				'image' => '',
				'name' => '',
				'product_id' => 0,
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
				'unit_price' => 0,
				'extgross' => 0,
				'extnet' => 0,
			),
			'logistics' => array(
				'units_delivered_received' => 0,
				'qtyinstock' => 0,
				'qtyindemand' => 0,
				'usageunit' => '',
			),
			'taxes' => self::getAvailableTaxes()['tax'],
			'custom' => array(
				// Filled by the MasterDetail mapping's 'fields' directive
			),
		);
	}
}