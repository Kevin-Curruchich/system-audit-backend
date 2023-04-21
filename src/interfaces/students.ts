export interface StudentType {
  studentTypeId?: string;
  studentTypeName: string;
  studentTypeDesc: string;
}

export interface Student {
  studentId: string;
  studentName: string;
  studentLastName: string;
  studentDni: string;
  studentPhone: string;
  studentEmail: string;
  studentStartDate: string;
  createdAt: string;
  studentTypeStudent: string;
}
