import { Entity, OneToMany } from "typeorm";
import base from "./base";
import B from './B'

@Entity()
export default class A extends base {
  @OneToMany(() => B, b => b.a)
  bs: B[];
}