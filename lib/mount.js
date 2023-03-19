"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = void 0;
const updateComponentInDom_1 = require("./updateComponentInDom");
const mount = (content, container) => {
    (0, updateComponentInDom_1.updateComponentInDom)(container, content);
};
exports.mount = mount;
