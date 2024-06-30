const acorn = require('acorn');
const walk = require('acorn-walk');
const escodegen = require('escodegen');

const SEVERITY = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const analyzeCodeBase = (codeBase) => {
    const suggestions = [];
    let ast;

    try {
        ast = acorn.parse(codeBase, { ecmaVersion: 2022, locations: true });
    } catch (error) {
        suggestions.push({
            type: 'Syntax Error',
            severity: SEVERITY.ERROR,
            description: `Failed to parse code: ${error.message}`,
            location: `Line ${error.loc.line}, Column ${error.loc.column}`
        });
        return { suggestions };
    }

    const scope = new Map();
    const functionComplexity = new Map();

    // Analyze AST
    walk.ancestor(ast, {
        VariableDeclaration(node, ancestors) {
            analyzeVariableDeclaration(node, ancestors, suggestions, scope);
        },
        BinaryExpression: {
            exit(node) {
                analyzeBinaryExpression(node, suggestions);
            }
        },
        FunctionDeclaration(node) {
            analyzeFunctionComplexity(node, functionComplexity);
        },
        FunctionExpression(node) {
            analyzeFunctionComplexity(node, functionComplexity);
        },
        ArrowFunctionExpression(node) {
            analyzeFunctionComplexity(node, functionComplexity);
        },
        Identifier(node, ancestors) {
            analyzeIdentifierUsage(node, ancestors, scope);
        },
        Comment(node) {
            analyzeComment(node, suggestions);
        }
    });

    // Analyze unused variables
    analyzeUnusedVariables(scope, suggestions);

    // Analyze function complexity
    analyzeFunctionComplexityResults(functionComplexity, suggestions);

    // Detect code duplication
    detectCodeDuplication(ast, suggestions);

    return { suggestions };
};

const analyzeVariableDeclaration = (node, ancestors, suggestions, scope) => {
    node.declarations.forEach(declaration => {
        if (declaration.init === null && node.kind === 'let') {
            suggestions.push({
                type: 'Optimization',
                severity: SEVERITY.WARNING,
                description: "Consider using 'const' instead of 'let' for variables that are not immediately assigned.",
                location: `Line ${node.loc.start.line}: ${escodegen.generate(node)}`
            });
        }
        scope.set(declaration.id.name, { node, used: false, ancestors });
    });
};

const analyzeBinaryExpression = (node, suggestions) => {
    if (node.operator === '==' || node.operator === '!=') {
        suggestions.push({
            type: 'Best Practice',
            severity: SEVERITY.WARNING,
            description: `Use '${node.operator}=' to avoid type coercion errors.`,
            location: `Line ${node.loc.start.line}: ${escodegen.generate(node)}`
        });
    }
};

const analyzeFunctionComplexity = (node, functionComplexity) => {
    const complexity = calculateCyclomaticComplexity(node);
    functionComplexity.set(node, complexity);
};

const analyzeIdentifierUsage = (node, ancestors, scope) => {
    if (scope.has(node.name)) {
        const variable = scope.get(node.name);
        if (!ancestors.includes(variable.node)) {
            variable.used = true;
        }
    }
};

const analyzeComment = (node, suggestions) => {
    if (node.type === 'Line' && node.value.trim().startsWith('//')) {
        suggestions.push({
            type: 'Code Cleanliness',
            severity: SEVERITY.INFO,
            description: 'Consider removing or improving this comment for cleaner code.',
            location: `Line ${node.loc.start.line}: ${node.value}`
        });
    }
};

const analyzeUnusedVariables = (scope, suggestions) => {
    scope.forEach((value, key) => {
        if (!value.used) {
            suggestions.push({
                type: 'Optimization',
                severity: SEVERITY.WARNING,
                description: `Unused variable '${key}' detected. Consider removing it.`,
                location: `Line ${value.node.loc.start.line}: ${escodegen.generate(value.node)}`
            });
        }
    });
};

const analyzeFunctionComplexityResults = (functionComplexity, suggestions) => {
    functionComplexity.forEach((complexity, node) => {
        if (complexity > 10) {
            suggestions.push({
                type: 'Code Quality',
                severity: SEVERITY.WARNING,
                description: `Function has a cyclomatic complexity of ${complexity}. Consider refactoring.`,
                location: `Line ${node.loc.start.line}: ${escodegen.generate(node).split('\n')[0]}`
            });
        }
    });
};

const detectCodeDuplication = (ast, suggestions) => {
    const codeBlocks = new Map();
    walk.simple(ast, {
        BlockStatement(node) {
            const code = escodegen.generate(node);
            if (codeBlocks.has(code)) {
                suggestions.push({
                    type: 'Redundancy',
                    severity: SEVERITY.WARNING,
                    description: 'Duplicate code block detected. Consider refactoring.',
                    location: `Line ${node.loc.start.line}: ${code.split('\n')[0]}`
                });
            } else {
                codeBlocks.set(code, node);
            }
        }
    });
};

const calculateCyclomaticComplexity = (node) => {
    let complexity = 1;
    walk.simple(node, {
        IfStatement: () => complexity++,
        ConditionalExpression: () => complexity++,
        LogicalExpression: (node) => { if (node.operator === '||' || node.operator === '&&') complexity++; },
        ForStatement: () => complexity++,
        WhileStatement: () => complexity++,
        DoWhileStatement: () => complexity++,
        CatchClause: () => complexity++,
        SwitchCase: () => complexity++
    });
    return complexity;
};

module.exports = analyzeCodeBase;