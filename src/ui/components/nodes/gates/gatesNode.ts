import AndGateNode from "./AndGateNode";
import NandGateNode from "./NandGateNode";
import NorGateNode from "./NorGateNode";
import NotGateNode from "./NotGateNode";
import OrGateNode from "./OrGateNode";
import XorGateNode from "./XorGateNode";

export const gateNodes = {
    AND: AndGateNode,
    OR: OrGateNode,
    NOT: NotGateNode,
    NAND: NandGateNode,
    NOR: NorGateNode,
    XOR: XorGateNode
};
