<script src="include/js/Inventory.js"></script>
<script src="include/js/Sortable.min.js"></script>
<script>
window.addEventListener("load", function(){
	var block = document.getElementsByClassName("cbds-inventory-block")[0];
	window.InventoryDetailsBlock = new InventoryBlock(block, {
			"linesContClass" : "cbds-inventorylines",
			"lineClass" : "cbds-inventoryline",
			"linePrefix" : "cbds-inventoryline",
			"inputPrefix" : "cbds-inventoryline__input",
			"aggrPrefix" : "cbds-inventoryaggr",
			"aggrInputPrefix" : "cbds-inventoryaggr__input"
	});
});
</script>

{* <pre>{$inventoryblock|print_r}</pre> *}

{include file='Components/Components.tpl'}
<!-- Detail block -->
<div class="cbds-detail-block cbds-inventory-block">
	<!-- Detail line preheader -->
	<div class="slds-grid slds-p-vertical_medium cbds-detail-line-preheader">
		<div class="slds-col slds-size_8-of-12 slds-p-left_medium">
			<span class="slds-icon_container slds-icon-utility-picklist-type" title="">
				<svg class="slds-icon slds-icon_small" aria-hidden="true">
					<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#picklist_type" xmlns:xlink="http://www.w3.org/1999/xlink" />
				</svg>
				<span class="slds-assistive-text">Description of icon when needed</span>
			</span>
		</div>
		<div class="slds-col slds-size_4-of-12 slds-grid">
			<div class="slds-col">
				<!-- Group/individual dropdown -->
				{$taxtypes[] = ['val' => 'individual', 'label' => $APP.LBL_INDIVIDUAL]}
				{$taxtypes[] = ['val' => 'group', 'label' => $APP.LBL_GROUP]}
				{if $inventoryblock.taxtype == 'group'}{$curtaxtype = $APP.LBL_GROUP}{else}{$curtaxtype = $APP.LBL_INDIVIDUAL}{/if}
				{call name=ProductDropdownFormElement size='1-of-1' fieldname='taxtype' value=$curtaxtype placeholder='Tax type' options=$taxtypes prefix='cbds-inventory-block__input'}
				<!-- // Group/individual dropdown -->
			</div>
			<div class="slds-col slds-p-right_medium">
				<div class="slds-button-group slds-float_right">
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border-inverse cbds-toolbox__tool" data-clickfunction="expandAllLines" title="Expand all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#expand_all"></use>
						</svg>
						<span class="slds-assistive-text">Expand or collapse this line</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border-inverse cbds-toolbox__tool" data-clickfunction="collAllLines" title="Collapse all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#collapse_all"></use>
						</svg>
						<span class="slds-assistive-text">Expand or collapse this line</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border-inverse cbds-toolbox__tool" data-clickfunction="insertNewLine" title="Add line" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
						</svg>
						<span class="slds-assistive-text">Expand or collapse this line</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border-inverse cbds-toolbox__tool" data-clickfunction="deleteAllLines" title="Delete all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#delete"></use>
						</svg>
						<span class="slds-assistive-text">Expand or collapse this line</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- // Detail line preheader -->
	<!-- LDS Detail line header -->
	<div class="slds-grid slds-border_bottom slds-p-vertical_small cbds-detail-line-header">
		<div class="slds-col slds-size_1-of-12 slds-p-left_x-small">
			<div class="slds-text-title_caps slds-text-color_inverse">Image</div>
		</div>
		<div class="slds-col slds-size-9-of-12">
			<div class="slds-grid">
				<div class="slds-col slds-size_3-of-12">
					<div class="slds-text-title_caps slds-text-color_inverse">Product name</div>
				</div>
				<div class="slds-col slds-size_1-of-12 slds-p-left_xx-small">
					<div class="slds-text-title_caps slds-text-color_inverse">Quantity</div>
				</div>
				<div class="slds-grid slds-size_3-of-12 slds-p-left_medium">
					<div class="slds-col slds-size_5-of-12">
						<div class="slds-text-title_caps slds-text-color_inverse">Discount type</div>
					</div>
					<div class="slds-col slds-size_6-of-12 slds-p-left_small">
						<div class="slds-text-title_caps slds-text-color_inverse">Discount</div>
					</div>
				</div>
				<div class="slds-col slds-size_2-of-12 slds-p-left_large">
					<div class="slds-text-title_caps slds-text-color_inverse">Discount amount</div>
				</div>
				<div class="slds-col slds-size_2-of-12 slds-p-left_x-large">
					<div class="slds-text-title_caps slds-text-color_inverse">Line total</div>
				</div>
			</div>
		</div>
		<div class="slds-col slds-size_2-of-12">
			<div class="slds-text-title_caps slds-p-left_large slds-text-color_inverse">Line tools</div>
		</div>
	</div>
	<!-- // LDS Detail line header -->
	<div class="cbds-detail-lines cbds-inventorylines">
		{foreach from=$inventoryblock.lines item=productline}
			{call name=InventoryLine data=$productline}
		{/foreach}
	</div>
	<!-- LDS Aggregations block -->
	<article class="slds-card">
		<div class="slds-card__header slds-grid">
			<header class="slds-media slds-media_center slds-has-flexi-truncate">
				<div class="slds-media__figure">
					<span class="slds-icon_container slds-icon-standard-contact" title="description of icon when needed">
						<svg class="slds-icon slds-icon_small" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/standard-sprite/svg/symbols.svg#product_required" xmlns:xlink="http://www.w3.org/1999/xlink" />
						</svg>
					</span>
				</div>
				<div class="slds-media__body">
					<h2>
						<a href="javascript:void(0);" class="slds-card__header-link slds-truncate" title="Total number of lines">
							<span class="slds-text-heading_small">Lines (<span class="cbds-inventoryaggr--linecount">{count($inventoryblock.lines)}</span>)</span>
						</a>
					</h2>
				</div>
			</header>
			<div class="slds-no-flex">
				<div class="slds-button-group">
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border cbds-toolbox__tool" data-clickfunction="expandAllLines" title="Expand all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#expand_all"></use>
						</svg>
						<span class="slds-assistive-text">Expand all lines</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border cbds-toolbox__tool" data-clickfunction="collAllLines" title="Collapse all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#collapse_all"></use>
						</svg>
						<span class="slds-assistive-text">Collapse all lines</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border cbds-toolbox__tool" data-clickfunction="insertNewLine" title="Add line" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#add"></use>
						</svg>
						<span class="slds-assistive-text">Insert a new line</span>
					</button>
					<button type="button" class="slds-button slds-button_icon slds-button_icon-border cbds-button--delete cbds-toolbox__tool" data-clickfunction="deleteAllLines" title="Delete all lines" aria-pressed="false">
						<svg class="slds-button__icon" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#delete"></use>
						</svg>
						<span class="slds-assistive-text">Delete all lines</span>
					</button>
				</div>
			</div>
		</div>
		<div class="slds-card__body cbds-inventoryaggr">
			<div class="slds-grid">
				<div class="slds-col slds-size_3-of-12">
					<div class="slds-panel">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate" title="Group Taxes">Group Taxes</h2>
						</div>
						<div class="slds-panel__body slds-p-around_none">
							<div class="slds-panel__section slds-p-around_none">
								<!-- Group aggregation taxes -->
								<div class="slds-form slds-p-around_small cbds-inventoryaggr__taxes--group{if $inventoryblock.taxtype == 'group'} active{/if}">
									<div class="slds-form-element__row slds-wrap">
										{foreach from=$inventoryblock.grouptaxes item=tax key=key name=name}
										<div class="slds-form-element__group">
											<fieldset class="slds-form-element">
												<legend class="slds-form-element__label slds-text-title_caps">{$tax.taxlabel}</legend>
												<div class="slds-grid">
												<div class="slds-col slds-form-element slds-size_5-of-12">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input class="slds-input cbds-inventoryaggr__input--tax{$key}" value="{$tax.percent}" type="text" data-type="number" data-taxname="tax{$key}" data-error-mess="Please insert a valid number">
														<span class="slds-icon_container slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">%</div>
														</span>
													</div>
													<div class="slds-form-element__help"></div>
												</div>
												<div class="slds-col slds-form-element slds-size_7-of-12">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input class="slds-input cbds-inventoryaggr__input--tax{$key}-amount" data-type="currency" readonly="readonly" value="{$tax.amount}" type="text">
														<span class="slds-icon_container slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
										{/foreach}
									</div>
								</div>
								<!-- // Group aggregation taxes -->
							</div>
						</div>
					</div>
				</div>
				<div class="slds-col slds-size_3-of-12">
					<div class="slds-panel">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate" title="Sales & Handling Taxes">Sales & Handling Taxes</h2>
						</div>
						<div class="slds-panel__body slds-p-around_none">
							<div class="slds-panel__section slds-p-around_none">
								<!-- Shipping and handling aggregation -->
								<div class="slds-form slds-p-around_small slds-p-around_medium cbds-inventoryaggr__taxes--sh">
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group">
											<fieldset class="slds-form-element">
												<legend class="slds-form-element__label slds-text-title_caps">Shipping & Handling amount</legend>
												<div class="slds-grid">
												<div class="slds-col slds-form-element slds-size_5-of-12">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input class="slds-input cbds-inventoryaggr__input--shamount" value="{$inventoryblock.aggr.shtotal}" type="text" data-type="currency" data-error-mess="Please insert a valid currency">
														<span class="slds-icon_container slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
													<div class="slds-form-element__help"></div>
												</div>
											</fieldset>
										</div>
										{foreach from=$inventoryblock.shtaxes item=shtax key=key name=name}
										<div class="slds-form-element__group">
											<fieldset class="slds-form-element">
												<legend class="slds-form-element__label slds-text-title_caps">{$shtax.taxlabel}</legend>
												<div class="slds-grid">
												<div class="slds-col slds-form-element slds-size_5-of-12">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input class="slds-input cbds-inventoryaggr__input--shtax{$key}" value="{$shtax.percent}" type="text" data-type="number" data-taxname="shtax{$key}" data-error-mess="Please insert a valid number">
														<span class="slds-icon_container slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">%</div>
														</span>
													</div>
													<div class="slds-form-element__help"></div>
												</div>
												<div class="slds-col slds-form-element slds-size_7-of-12">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input class="slds-input cbds-inventoryaggr__input--shtax{$key}-amount" data-type="currency" readonly="readonly" value="{$shtax.amount}" type="text">
														<span class="slds-icon_container slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
										{/foreach}
									</div>
								</div>
								<!-- // Shipping and handling aggregation -->
							</div>
						</div>
					</div>
				</div>
				<div class="slds-col">
					<div class="slds-panel">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate slds-text-align_right" title="Totals">Totals</h2>
						</div>
						<div class="slds-panel__body slds-p-around_none">
							<div class="slds-panel__section slds-p-around_none">
								<!-- Totals -->
								<div class="slds-form slds-p-around_small slds-p-around_medium cbds-inventoryaggr__taxes--sh">
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group slds-float_right" style="min-width:25rem; clear: both;">
											<fieldset class="slds-form-element slds-form-element_horizontal slds-m-bottom_none">
												<legend class="slds-form-element__label slds-text-title_caps">Gross total</legend>
												<div class="slds-col slds-form-element">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input type="text" readonly="readonly" data-type="currency" class="slds-input cbds-inventoryaggr__input--grosstotal" value="{$inventoryblock.aggr.grosstotal}" />
														<span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
									</div>
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group slds-float_right" style="min-width:25rem; clear: both;">
											<fieldset class="slds-form-element slds-form-element_horizontal slds-m-bottom_none">
												<legend class="slds-form-element__label slds-text-title_caps">Total discount</legend>
												<div class="slds-col slds-form-element">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input type="text" readonly="readonly" data-type="currency" class="slds-input cbds-inventoryaggr__input--totaldiscount" value="{$inventoryblock.aggr.totaldiscount}" />
														<span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
									</div>
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group slds-float_right" style="min-width:25rem; clear: both;">
											<fieldset class="slds-form-element slds-form-element_horizontal slds-m-bottom_none">
												<legend class="slds-form-element__label slds-text-title_caps">Total taxes</legend>
												<div class="slds-col slds-form-element">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input type="text" readonly="readonly" data-type="currency" class="slds-input cbds-inventoryaggr__input--taxtotal" value="{$inventoryblock.aggr.taxtotal}" />
														<span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
									</div>
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group slds-float_right" style="min-width:25rem; clear: both;">
											<fieldset class="slds-form-element slds-form-element_horizontal slds-m-bottom_none">
												<legend class="slds-form-element__label slds-text-title_caps">Net total</legend>
												<div class="slds-col slds-form-element">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input type="text" readonly="readonly" data-type="currency" class="slds-input cbds-inventoryaggr__input--subtotal" value="{$inventoryblock.aggr.subtotal}" />
														<span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
									</div>
									<div class="slds-form-element__row slds-wrap">
										<div class="slds-form-element__group slds-float_right" style="min-width:25rem; clear: both;">
											<fieldset class="slds-form-element slds-form-element_horizontal slds-m-bottom_none">
												<legend class="slds-form-element__label slds-text-title_caps">Total</legend>
												<div class="slds-col slds-form-element">
													<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
														<input type="text" readonly="readonly" data-type="currency" class="slds-input cbds-inventoryaggr__input--total" value="{$inventoryblock.aggr.total}" />
														<span class="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_left">
															<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
														</span>
													</div>
												</div>
											</fieldset>
										</div>
									</div>
								</div>
								<!-- // Totals -->
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Aggregation tax block -->
			<div class="cbds-inventoryaggr__taxes">
			</div>
			<!-- // Aggregation tax block -->
		</div>
	</article>
	<!-- // LDS Aggregations block -->
	<div style="display: none;" class="cbds-inventorylines__domfields"></div>
</div>

<!-- Detail block -->
<!-- Template -->
{$custom = $inventoryblock.lines[0].custom}
{call name=InventoryLine template=true custom=$custom}
<!-- // Template -->