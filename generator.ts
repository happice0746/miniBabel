import { ASTNode } from "./type";

export const generator = (node:ASTNode):string => { 
    switch (node.type) {
        case 'Program':
            if (node.body) {
                const body = node.body as ASTNode[]
                return body.map(generator).join('\n');
            }  
        case 'identifier':
            return node.identifierName as string;
        case 'functionDeclaration':
            if (node.params) {
                return `function ${node.identifierName} (${node.params.map(generator)}) ${generator(node.body as ASTNode)}`;
            }
        case 'BlockStatement':
            if (node.body) {
                const body = node.body as ASTNode[]
                return `{ ${body.map(generator)} }`;
            } 
        case 'returnStatement':
            if (node.arguments) {
                return `return ${generator(node.arguments)}`;
            }
        case 'BinaryExpression':
            if (node.left && node.operator && node.right){
                return `${generator(node.left)} ${generator(node.operator)} ${generator(node.right)}`;
            }
        case 'operator':
            return node.identifierName as string;
        default:
            throw new TypeError(node.type);
    }
}
