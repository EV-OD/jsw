import * as t from '@babel/types';

export function mapTsType(tsType) {
    if (!tsType) return 'f64';
    if (t.isTSNumberKeyword(tsType)) return 'f64';
    if (t.isTSStringKeyword(tsType)) return 'string';
    if (t.isTSBooleanKeyword(tsType)) return 'bool';
    if (t.isTSVoidKeyword(tsType)) return 'void';
    if (t.isTSTypeReference(tsType)) {
        if (tsType.typeName.name === 'Array') {
            const param = tsType.typeParameters.params[0];
            return `Array<${mapTsType(param)}>`;
        }
        return tsType.typeName.name;
    }
    if (t.isTSArrayType(tsType)) {
        return `Array<${mapTsType(tsType.elementType)}>`;
    }
    if (t.isTSFunctionType(tsType)) {
        const params = tsType.parameters.map(p => mapTsType(p.typeAnnotation ? p.typeAnnotation.typeAnnotation : null)).join(',');
        const returnType = mapTsType(tsType.typeAnnotation ? tsType.typeAnnotation.typeAnnotation : null);
        return 'Closure'; // Function pointer
    }
    return 'f64';
}
