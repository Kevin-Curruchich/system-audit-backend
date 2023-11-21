import { PaginationFilterDto } from "../../../shared/dto/pagination-filter.dto";

export interface GetColllectionStudentPaginationDto
  extends PaginationFilterDto {
  searchQuery?: string;
  currentYear?: number;
  quartetlyId?: string;
}
