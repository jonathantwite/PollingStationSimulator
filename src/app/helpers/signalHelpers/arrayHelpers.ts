import { WritableSignal } from "@angular/core";

function front<T>(signalArray: WritableSignal<T[]>){
  let array = signalArray();
  if (array.length === 0) {
    return undefined
  }
  return array[0];
};

function tail<T>(signalArray: WritableSignal<T[]>){
  let array = signalArray();
  if (array.length === 0) {
    return undefined
  }
  return array[array.length - 1];
}

function dequeue<T>(signalArray: WritableSignal<T[]>){
  let array = signalArray();
  if (array.length === 0) {
    return undefined
  }
  let element = array.splice(0, 1);
  signalArray.set(array);
  return element[0];
};

function enqueue<T>(signalArray: WritableSignal<T[]>, element: T){
  signalArray.update(arr => [...arr, element]);
};

export {
    front,
    tail,
    dequeue, 
    enqueue
};