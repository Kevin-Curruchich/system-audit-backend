import { IsString, IsDefined, IsOptional } from "class-validator";
import { Student } from "./";

export class StudentType {
    @IsDefined()
    @IsString()
    studentTypeId!: string;

    @IsDefined()
    @IsString()
    studentTypeName!: string;

    @IsDefined()
    @IsString()
    studentTypeDesc!: string;

    @IsOptional()
    student?: Student;
}
