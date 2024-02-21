export interface PutCollectionDto {
  collectionName: string;
  collectionDesc: string;
  collectionTypeId: string;
  collectionBaseAmount: number;
  collectionStudentApply: { studentTypeId: string }[];
}
