import {Debugger} from "./debugger.ts";

declare const parent: any;
declare const Module: any;

class DigitalHuman {
    static speak = (message: Uint8Array): void => {
        const arrayBuffer = message.buffer;
        const view: Uint8Array = new Uint8Array(arrayBuffer);
        const arrayBufferPtr: number = parent.Module._malloc(arrayBuffer.byteLength);
        console.log("arrayBufferPtr", arrayBufferPtr.toString());
        console.log("view", view);

        parent.Module.HEAPU8.set(view, arrayBufferPtr);
        console.log("buffer.byteLength", arrayBuffer.byteLength);
        parent.Module._setAudioBuffer(arrayBufferPtr, arrayBuffer.byteLength);
        parent.Module._free(arrayBufferPtr);
    }
}

(window as any).DigitalHuman = DigitalHuman;
export default DigitalHuman;
