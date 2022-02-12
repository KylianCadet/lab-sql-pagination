import * as App from "express";

export default class Timer {
  private _date: Date | undefined = undefined;
  private _name: string = undefined;

  start(name: string): void {
    this._date = new Date();
    this._name = name;
  };

  stop(): void {
    const dt = new Date().getTime() - this._date.getTime();
    console.log(`${this._name} - ${dt} ms`);
  }
}