"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = void 0;
const html = (strings, ...values) => {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            result += values[i];
        }
    }
    return result;
};
exports.html = html;
