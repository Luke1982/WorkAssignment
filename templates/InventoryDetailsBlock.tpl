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
	<div class="slds-grid slds-p-vertical_medium slds-theme_alt-inverse" style="border-radius: 0.25rem 0.25rem 0 0;">
		<div class="slds-col slds-size_8-of-12 slds-p-left_medium">
			<span class="slds-icon_container slds-icon-utility-picklist-type" title="">
				<svg class="slds-icon slds-icon_small" aria-hidden="true">
					<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#picklist_type" xmlns:xlink="http://www.w3.org/1999/xlink" />
				</svg>
				<span class="slds-assistive-text">Description of icon when needed</span>
			</span>
		</div>
		<div class="slds-col slds-size_4-of-12 slds-grid">
			<div class="slds-col slds-text-color_default">
				<!-- Group/individual dropdown -->
				{$taxtypes[] = ['val' => 'individual', 'label' => $APP.LBL_INDIVIDUAL]}
				{$taxtypes[] = ['val' => 'group', 'label' => $APP.LBL_GROUP]}
				{if $inventoryblock.taxtype == 'group'}{$curtaxtype = $APP.LBL_GROUP}{else}{$curtaxtype = $APP.LBL_INDIVIDUAL}{/if}
				{call name=ProductDropdownFormElement size='1-of-1' fieldname='taxtype' value=$inventoryblock.taxtype placeholder='Tax type' options=$taxtypes prefix='cbds-inventory-block__input' valuelabel=$curtaxtype}
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
	<div class="slds-grid slds-border_bottom slds-p-vertical_small slds-theme_inverse" style="border-radius: 0 0 0.25rem 0.25rem;">
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
				<div class="slds-grid slds-size_3-of-12">
					<div class="slds-col slds-size_5-of-12">
						<div class="slds-text-title_caps slds-text-color_inverse">Discount type</div>
					</div>
					<div class="slds-col slds-size_6-of-12 slds-p-left_small">
						<div class="slds-text-title_caps slds-text-color_inverse">Discount</div>
					</div>
				</div>
				<div class="slds-col slds-size_2-of-12">
					<div class="slds-text-title_caps slds-text-color_inverse">Discount amount</div>
				</div>
				<div class="slds-col slds-size_2-of-12">
					<div class="slds-text-title_caps slds-text-color_inverse">Line total</div>
				</div>
			</div>
		</div>
		<div class="slds-col slds-size_2-of-12">
			<div class="slds-text-title_caps slds-p-right_small slds-text-color_inverse slds-text-align_right">Line tools</div>
		</div>
	</div>
	<!-- // LDS Detail line header -->
	<div class="cbds-detail-lines cbds-inventorylines">
		{foreach from=$inventoryblock.lines item=productline}
			{call name=InventoryLine data=$productline}
		{/foreach}
	</div>
	<!-- LDS Aggregations block -->
	<article class="slds-card slds-theme_shade">
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
				<div class="slds-button-group slds-theme_default">
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
				<div class="slds-col slds-size_4-of-12">
					<div class="slds-panel slds-m-around_small slds-theme_shade slds-theme_alert-texture slds-box cbds-inventoryaggr__taxes--group{if $inventoryblock.taxtype == 'group'} active{/if}">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate slds-text-color_default" title="Group Taxes">Group Taxes</h2>
						</div>
						<div class="slds-panel__body slds-p-around_none">
							<div class="slds-panel__section slds-p-around_none">
								<!-- Group aggregation taxes -->
								<div class="slds-text-color_default slds-form slds-p-around_small">
									<div class="slds-form-element__row slds-wrap">
										{foreach from=$inventoryblock.grouptaxes item=tax key=key name=name}
										<fieldset class="slds-form-element slds-form-element_compound slds-is-editing slds-form-element_horizontal">
											<legend class="slds-form-element__legend slds-form-element__label">{$tax.taxlabel}</legend>
											<div class="slds-form-element__control">
												<div class="slds-form-element__row slds-wrap">
													<div class="slds-size_1-of-1 slds-large-size_1-of-2">
														<div class="slds-form-element">
															<label class="slds-form-element__label">Percentage</label>
															<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
																<input data-savefield="{$tax.taxname}_perc" class="slds-input cbds-inventoryaggr__input--{$tax.taxname}" value="{$tax.percent}" type="text" data-type="number" data-taxname="{$tax.taxname}" data-error-mess="Please insert a valid number">
																<span class="slds-icon_container slds-input__icon slds-input__icon_left" style="left: 0.75rem;">
																	<div class="slds-text-body_regular slds-text-color_weak">%</div>
																</span>
															</div>
														</div>
													</div>
													<div class="slds-size_1-of-1 slds-large-size_1-of-2">
														<div class="slds-form-element">
															<label class="slds-form-element__label">Amount</label>
															<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
																<input data-savefield="{$tax.taxname}_amount" class="slds-input cbds-inventoryaggr__input--{$tax.taxname}-amount" data-type="currency" readonly="readonly" value="{$tax.amount}" type="text">
																<span class="slds-icon_container slds-input__icon slds-input__icon_left" style="left: 0.3rem;">
																	<div class="slds-text-body_regular">&euro;</div>
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
										{/foreach}
									</div>
								</div>
								<!-- // Group aggregation taxes -->
							</div>
						</div>
					</div>
				</div>
				<div class="slds-col slds-size_4-of-12">
					<div class="slds-panel slds-m-around_small slds-theme_shade slds-theme_alert-texture slds-box">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate" title="Sales & Handling">Sales & Handling</h2>
						</div>
						<div class="slds-panel__body slds-p-around_none">
							<div class="slds-panel__section slds-p-around_none">
								<!-- Shipping and handling aggregation -->
								<div class="slds-text-color_default slds-form slds-p-around_small slds-p-around_medium cbds-inventoryaggr__taxes--sh">
									<div class="slds-form-element__row slds-wrap">
										<fieldset class="slds-form-element slds-form-element_compound slds-is-editing slds-form-element_horizontal">
											<legend class="slds-form-element__legend slds-form-element__label">S&H amount</legend>
											<div class="slds-form-element__control">
												<div class="slds-form-element__row">
													<div class="slds-size_1-of-1">
														<div class="slds-form-element">
															<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
																<input data-savefield="pl_sh_total" class="slds-input cbds-inventoryaggr__input--pl_sh_total" value="{$inventoryblock.aggr.pl_sh_total}" type="text" data-type="currency" data-error-mess="Please insert a valid currency">
																<span class="slds-icon_container slds-input__icon slds-input__icon_left" style="left: 0.75rem;">
																	<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
										{foreach from=$inventoryblock.shtaxes item=shtax key=key name=name}
										<fieldset class="slds-form-element slds-form-element_compound slds-is-editing slds-form-element_horizontal">
											<legend class="slds-form-element__legend slds-form-element__label">{$shtax.taxlabel}</legend>
											<div class="slds-form-element__control">
												<div class="slds-form-element__row slds-wrap">
													<div class="slds-size_1-of-1 slds-large-size_1-of-2">
														<div class="slds-form-element">
															<label class="slds-form-element__label">Percentage</label>
															<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
																<input data-savefield="{$shtax.taxname}_perc" class="slds-input cbds-inventoryaggr__input--{$shtax.taxname}" value="{$shtax.percent}" type="text" data-type="number" data-taxname="{$shtax.taxname}" data-error-mess="Please insert a valid number">
																<span class="slds-icon_container slds-input__icon slds-input__icon_left" style="left: 0.75rem;">
																	<div class="slds-text-body_regular slds-text-color_weak">%</div>
																</span>
															</div>
														</div>
													</div>
													<div class="slds-size_1-of-1 slds-large-size_1-of-2">
														<div class="slds-form-element">
															<label class="slds-form-element__label">Amount</label>
															<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
																<input data-savefield="{$shtax.taxname}_amount" class="slds-input cbds-inventoryaggr__input--{$shtax.taxname}-amount" data-type="currency" readonly="readonly" value="{$shtax.amount}" type="text">
																<span class="slds-icon_container slds-input__icon slds-input__icon_left" style="left: 0.3rem;">
																	<div class="slds-text-body_regular slds-text-color_weak">&euro;</div>
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
										{/foreach}
									</div>
								</div>
								<!-- // Shipping and handling aggregation -->
							</div>
						</div>
					</div>
				</div>
				<div class="slds-col slds-size_4-of-12">
					<div class="slds-panel slds-m-around_small slds-box slds-theme_shade">
						<div class="slds-panel__header">
							<h2 class="slds-panel__header-title slds-text-heading_small slds-truncate slds-text-align_right" title="Totals">Totals</h2>
						</div>
						<div class="slds-panel__body">
							<div class="slds-panel__section slds-p-right_none">
								<!-- Totals -->
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Gross total</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_gross_total" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--grosstotal" value="{$inventoryblock.aggr.grosstotal}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Line discounts</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_dto_line" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--pl_dto_line" value="{$inventoryblock.aggr.pl_dto_line}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Global discount</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_dto_global" type="text" data-type="number" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--pl_dto_global" value="{$inventoryblock.aggr.pl_dto_global}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Total discount</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_dto_total" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--totaldiscount" value="{$inventoryblock.aggr.totaldiscount}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Total taxes</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="sum_taxtotal" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--taxtotal" value="{$inventoryblock.aggr.taxtotal}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Net total BGD</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="sum_nettotal" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--sum_nettotal" value="{$inventoryblock.aggr.sum_nettotal}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Net total AGD</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_net_total" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--subtotal" value="{$inventoryblock.aggr.subtotal}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">S&H Tax</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_sh_tax" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--shtaxtotal" value="{$inventoryblock.aggr.shtaxtotal}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Adjustment</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_adjustment" type="text" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--pl_adjustment" value="{$inventoryblock.aggr.pl_adjustment}" />
											</div>
										</div>
									</div>
								</div>
								<div class="slds-grid">
									<div class="slds-col slds-size_7-of-12">
										<div class="slds-text-title_caps slds-text-align_right slds-p-top_x-small slds-m-right_small">Total</div>
									</div>
									<div class="slds-col slds-size_5-of-12">
										<div class="slds-grid">
											<div class="slds-col slds-text-color_weak slds-size_2-of-12 slds-p-top_x-small">&euro;</div>
											<div class="slds-col slds-size_10-of-12">
												<input data-savefield="pl_grand_total" type="text" readonly="readonly" data-type="currency" class="slds-p-right_none slds-text-align_right slds-input cbds-inventoryaggr__input--total" value="{$inventoryblock.aggr.total}" />
											</div>
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
	<div style="display: none;" class="cbds-inventoryaggr__domfields"></div>
</div>

<!-- Detail block -->
<!-- Template -->
{$custom = $inventoryblock.lines[0].custom}
{call name=InventoryLine template=true custom=$custom}
<!-- // Template -->