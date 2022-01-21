import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import base from "./base";

@Entity()
export default class A extends base {
  @Column()
  test: number;
}