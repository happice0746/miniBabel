import type { ASTNode, Token, Body } from "./type";

export const parser = (tokens:Token[]) => {
    let current:number = 0;
    let temp:number[] = [];
    let ast:ASTNode = {
        type: 'Program',
        body: []
    };
    const token = () => {
        return tokens[current];
    }
    const parseDeclarations = () => {
        if (token().type === 'identifier' && (token().value === 'const' || token().value === 'let')) {
            const declarations:ASTNode = {
                type: 'VariableDeclaration',
                kind: token().value
            };
            next();
            if (token().type !== 'identifier') {
                throw new Error('Expected variable after const');
            }
            declarations.identifierName = token().value;
            next()
            // if (token.type === 'operator' && token.value === '='){} ts报错
            if(token().type === 'operator' && token().value === '=') {
                declarations.init = parseFunctionExpression();
            }
            return declarations;
        }
    }
    const parseFunctionExpression = () => {
        next();
        let init:ASTNode = {
            type: '',
            params: [],
            body: [],
        };
        if(token().value === '(' && token().type === 'parents' || token().type === 'identifier') {
            setTemp();
            next();
            while (token().type === 'identifier' || token().value === ',') {
                next();
            }
            if (token().type === 'parents' && token().value === ')') {
                next();
                if (token().type === 'arrowFunction') {
                    init.type = 'arrowFunction'
                    backTemp();
                    init.params = parseParams();
                    // 解析箭头函数的函数主体
                    init.body = parseExpression();
                } else {
                    // why
                    backTemp();
                }
            }
        }
        return init;
    }
    const parseParams = () => {
        const params:ASTNode[] = [];
        if(token().value === '(' && token().type === 'parents') {
            next();
            while (token().value !== ')' && token().type !=='parents') {
                if(token().type === 'identifier') {
                    params.push({
                        type: token().type,
                        identifierName: token().value
                    })
                }
                next()
            }
        }
        return params;
    }
    const parseExpression = () => {
        next();
        let body:Body = {
            type:'',
            left:{
                type:''
            },
            operator:{
                type:''
            },
            right:{
                type:''
            }
        };
        if (token().type === 'arrowFunction') {
            next();
        }
        if (token().type === 'identifier') {
            body.type = 'BinaryExpression';
            body.left = {
                type: token().type,
                identifierName: token().value,
            }
            next();
            if (token().type === 'operator') {
                body.operator = {
                    type: token().type,
                    identifierName: token().value,
                }
            }
            next();
            body.right = {
                type: token().type,
                identifierName: token().value,
            }
        }
        return body;
    }
    const next = () => {
        do {
            current++;
            if (!token()) {
                tokens[current] = { type: 'EOF', value: '' };
            }
        } while(token().type === 'space');
    }
    const setTemp = ():void => {
        temp.push(current);
    }
    const backTemp = ():void => {          
        current = temp.pop() as number;
    }

    while (current < tokens.length) {
        const statement = parseDeclarations();
        if (!statement) {
            break;
        }
        const body = ast.body as ASTNode[];
        body.push(statement);
    }
    return ast;
}