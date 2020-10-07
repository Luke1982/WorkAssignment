# WorkAssignment
A corebos module that lets you create Work Assignments (on location) for users

## Changes that need to be in corebos
- InventoryLine, InventoryField and InventoryBlock need to be in Inventory.js
- Sortable needs to be included
- cbNumber and ldsCheckbox need to be in general.js
- Components in smarty Components
- Styles in style.css

## Todo
- Create address fields
- Handle conversion from other records
- handle duplication
- Make block read-only when in detailview
- Join retrieving existing inventorylines on services as well, right now it's only products

## Issues
- Right now the 'InventoryLine' JS module just counts the taxes and tries to find them by
  looking for the fieldname with the corresponding iteration. But when a tax is disabled and
  another created (e.g. tax3 is disabled and tax4 is created) this doesn't work since the
  JS module tries to find tax3 (looking by iteration) while in fact it need to look for tax4