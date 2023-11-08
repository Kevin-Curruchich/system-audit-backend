export interface PutStudentDto {
  studentName: string;
  studentLastName: string;
  studentFullName: string;
  studentDni?: string;
  studentPhone?: string;
  studentEmail?: string;
  studentStartDate: Date;
  studentTypeId?: string;
  studentCurrentYear?: number;
  studentAddress?: string;
  studentCountry?: string;
  studentCity?: string;
  studentProvince?: string;
  studentBirthDate: Date;
  studentStatusId?: string;
  studentObservations?: string;
  studentId?: string;
}
