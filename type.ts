export type Token = {
    type:string,
    value:string,
}
export type ASTNode = {
    type: string,
    body?: Body,
    init?: ASTNode,
    kind?: string,
    identifierName?: string,
    params?: ASTNode[],
    left?:ASTNode,
    operator?:ASTNode,
    right?:ASTNode,
    arguments?:ASTNode,
    _context?:ASTNode[]
}
export type Body = ASTNode | ASTNode[]