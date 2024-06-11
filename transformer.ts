import { traverser } from "./traverser";
import { ASTNode, Body } from "./type";
export const transformer = (ast:ASTNode):ASTNode => {
    const newAst = {
        type: 'Program',
        body: []
    }
    ast._context = newAst.body;
    traverser(ast, {
        VariableDeclaration: (node:ASTNode, parent:ASTNode)=>{
            const functionDeclaration:ASTNode = {
                type:'',
                params: [],
                body:{} as Body,
            };
            const init = node.init;
            const initBody = init?.body as ASTNode;
            if (init?.type === 'arrowFunction') {
                functionDeclaration.type = 'functionDeclaration';
                functionDeclaration.identifierName = node.identifierName;
            }
            if (initBody.type === 'BinaryExpression') {
                const body:ASTNode = {
                    type: 'BlockStatement',
                    body: [{
                        type:'returnStatement',
                        arguments: init?.body as ASTNode
                    }]
                }
                functionDeclaration.body = body;
            }
            parent._context?.push(functionDeclaration);
        },
        identifier: (node:ASTNode, parent:ASTNode) => {
            if (parent.type === 'arrowFunction' && ast._context) {
                ast._context[0].params?.push({
                    type: 'identifier',
                    identifierName: node.identifierName
                });
            }
        }
    })
    console.dir(newAst, {depth:null});
    console.dir(ast, {depth:null});
    return newAst;
}