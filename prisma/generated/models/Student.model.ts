import { IsString, IsDefined, IsDate } from "class-validator";
import { StudentType } from "./";

export class Student {
    @IsDefined()
    @IsString()
    studentId!: string;

    @IsDefined()
    @IsString()
    studentName!: string;

    @IsDefined()
    @IsString()
    studnetLastName!: string;

    @IsDefined()
    @IsString()
    studentDni!: string;

    @IsDefined()
    @IsString()
    studentPhone!: string;

    @IsDefined()
    @IsString()
    studentEmail!: string;

    @IsDefined()
    @IsDate()
    studentStartDate!: Date;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    StudentType!: StudentType;

    @IsDefined()
    @IsString()
    studentTypeStudent!: string;
}
