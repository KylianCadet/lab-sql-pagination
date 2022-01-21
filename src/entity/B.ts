import { Entity, Column } from "typeorm";
import base from "./base";

@Entity()
export default class B extends base {
  @Column()
  test: number;
}