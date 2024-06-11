import { ASTNode } from "./type";

export const traverser = (ast:ASTNode, visitor:any) =>{
    const traverseArray = (nodeArray:ASTNode[], parent:ASTNode) => {
        nodeArray.forEach((node:ASTNode)=>{
            traverseNode(node, parent);    
        })
    }
    const traverseNode = (node:ASTNode, parent:ASTNode | null) => {
        const method = visitor[node.type];
        if (method) {
            method(node, parent);
        }
        switch(node.type) {
            case 'Program':
                traverseArray(node.body as ASTNode[], node);
                break;
            case 'VariableDeclaration':
                if (node.init) {
                    traverseNode(node.init, node);
                }
                break;
            case 'arrowFunction':
                traverseNode(node.body as ASTNode, node);
                traverseArray(node.params as ASTNode[], node);
                break;
        }
    }
    traverseNode(ast, null);
} 