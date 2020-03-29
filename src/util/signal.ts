export type ICallback<ArgType> = (arg: ArgType) => any;

export default class Signal<ArgType> {
  private callbacks: ICallback<ArgType>[] = [];

  constructor() {
    this.dispatch.bind(this);
  }

  public add(callback: ICallback<ArgType>) {
    this.callbacks.push(callback);
  }

  public unsubscribe(callback: ICallback<ArgType>): void {
    const index = this.callbacks.indexOf(callback);
    if (index < 0) {
      throw new Error("Trying to remove unexisting callback");
    }
    this.callbacks.splice(index, 1);
  }

  public dispatch = (arg: ArgType) => {
    for (let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](arg);
    }
  }
}
