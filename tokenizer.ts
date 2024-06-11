import type { Token } from "./type";

export const tokenizer = (code: string):Token[] => {
    let current:number = 0;
    let tokens:Token[] = [];
    while(current < code.length) {
        if (/\(|\)/.test(code[current])) {
            tokens.push({
                type: 'parents',
                value: code[current],
            })
            current++;
            continue;
        }
        if (/,/.test(code[current])) {
            tokens.push({
                type: 'comma',
                value: code[current],
            })
            current++;
            continue;
        }
        if (/\s/.test(code[current])) {
            tokens.push({
                type: 'space',
                value: code[current],
            })
            current++;
            continue;
        }
        if (/=|\+|>/.test(code[current])) {
            let value:string = code[current];
            current++;
            while(/=|\+|>/.test(code[current]) && current < code.length) {
                value += code[current];
                current++;
            }
            tokens.push({
                type:  value === '=>' ? 'arrowFunction' : 'operator',
                value,
            })
            continue;
        }
        if (/[a-zA-Z\$\_]/.test(code[current])) {
            let value:string = code[current];
            current++;
            while(/[a-zA-Z\$\_]/.test(code[current]) && current < code.length) {
                value += code[current];
                current++;
            }
            tokens.push({
                type: 'identifier',
                value,
            })
            continue;
        }
        throw new Error('无法词法分析')
    }
    
    return tokens;
}