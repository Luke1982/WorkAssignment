# WorkAssignment
A corebos module that lets you create Work Assignments (on location) for users

## Changes that need to be in corebos
- Sortable needs to be included
- Styles in style.css

## Todo
- Create address fields
- Handle conversion from other records
- handle duplication

## Issues
- Right now the 'InventoryLine' JS module just counts the taxes and tries to find them by
  looking for the fieldname with the corresponding iteration. But when a tax is disabled and
  another created (e.g. tax3 is disabled and tax4 is created) this doesn't work since the
  JS module tries to find tax3 (looking by iteration) while in fact it need to look for tax4