import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class base {
  @PrimaryGeneratedColumn()
  id: number;
}