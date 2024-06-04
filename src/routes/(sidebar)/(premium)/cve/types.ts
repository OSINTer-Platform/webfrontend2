import type {
  CVEDateField,
  CVESEarchQuery,
  CVESortBy,
  SortOrder,
} from "$shared/types/api";

export interface RequiredCVESEarchQuery extends CVESEarchQuery {
  sort_by: CVESortBy;
  sort_order: SortOrder;

  date_field: CVEDateField;
}
