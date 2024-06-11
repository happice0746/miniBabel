import { generator } from './generator';
import { parser } from './parser';
import { tokenizer } from './tokenizer';
import { transformer } from './transformer';
import { Token } from './type';
export const compiler = (input:string) => {
    const tokens:Token[] = tokenizer(input);
    const ast:any = parser(tokens);
    const newAst:any = transformer(ast);
    const output:any = generator(newAst);
    return output;
};

const str = 'let add = (a, b, c) => a + b';

const result = compiler(str);

console.log(result);
