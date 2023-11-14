export interface PutQuarterDto {
  quartetlyName: string;
  quartetlyStart: Date;
  quartetlyEnd: Date;
  quartetlyStatusId: string;
  quartetlyIsActive?: boolean;
}
