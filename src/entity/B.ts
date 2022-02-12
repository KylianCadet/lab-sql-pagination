import { Entity, Column, ManyToOne } from "typeorm";
import A from "./A";
import base from "./base";

@Entity()
export default class B extends base {
  @ManyToOne(() => A, a => a.bs)
  a: A;

  @Column()
  key: '1' | '2' | '3';

  @Column()
  value: number;
}