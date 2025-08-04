/**
 * JuriBank Platform - Banking-Grade ESLint Configuration
 * Security-focused linting rules for financial applications
 */

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:sonarjs/recommended'
    ],
    plugins: [
        'security',
        'sonarjs'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Security Rules - Critical for Banking Applications
        'security/detect-object-injection': 'error',
        'security/detect-non-literal-fs-filename': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-non-literal-require': 'error',
        'security/detect-possible-timing-attacks': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-unsafe-regex': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-child-process': 'error',
        'security/detect-disable-mustache-escape': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-new-buffer': 'error',
        'security/detect-no-csrf-before-method-override': 'error',

        // Code Quality Rules
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        'no-proto': 'error',
        'no-extend-native': 'error',
        'no-caller': 'error',
        'no-iterator': 'error',
        'no-with': 'error',

        // Banking-Specific Security Rules
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-alert': 'error',
        'no-unused-vars': ['error', { 
            'vars': 'all', 
            'args': 'after-used',
            'argsIgnorePattern': '^_'
        }],

        // Input Validation and Sanitization
        'no-param-reassign': ['error', { 
            'props': true,
            'ignorePropertyModificationsFor': ['acc', 'accumulator', 'e', 'ctx', 'req', 'request', 'res', 'response', '$scope', 'staticContext']
        }],
        'no-return-assign': ['error', 'always'],
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-void': 'error',

        // Best Practices for Financial Applications
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'consistent-return': 'error',
        'curly': ['error', 'all'],
        'default-case': 'error',
        'dot-notation': 'error',
        'eqeqeq': ['error', 'always'],
        'guard-for-in': 'error',
        'no-case-declarations': 'error',
        'no-else-return': 'error',
        'no-empty-function': 'error',
        'no-empty-pattern': 'error',
        'no-fallthrough': 'error',
        'no-floating-decimal': 'error',
        'no-global-assign': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-magic-numbers': ['warn', { 
            'ignore': [-1, 0, 1, 2, 100, 1000],
            'ignoreArrayIndexes': true,
            'enforceConst': true,
            'detectObjects': false
        }],
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-wrappers': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-redeclare': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-unused-expressions': 'error',
        'no-useless-escape': 'error',
        'no-useless-return': 'error',
        'prefer-promise-reject-errors': 'error',
        'radix': 'error',
        'vars-on-top': 'error',
        'wrap-iife': ['error', 'outside'],
        'yoda': 'error',

        // Variables
        'init-declarations': ['error', 'always'],
        'no-catch-shadow': 'off',
        'no-delete-var': 'error',
        'no-label-var': 'error',
        'no-restricted-globals': 'error',
        'no-shadow': 'error',
        'no-shadow-restricted-names': 'error',
        'no-undef': 'error',
        'no-undef-init': 'error',
        'no-undefined': 'error',
        'no-use-before-define': ['error', { 'functions': true, 'classes': true }],

        // SonarJS Rules for Code Quality
        'sonarjs/cognitive-complexity': ['error', 15],
        'sonarjs/max-switch-cases': ['error', 30],
        'sonarjs/no-all-duplicated-branches': 'error',
        'sonarjs/no-collapsible-if': 'error',
        'sonarjs/no-collection-size-mischeck': 'error',
        'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
        'sonarjs/no-duplicated-branches': 'error',
        'sonarjs/no-element-overwrite': 'error',
        'sonarjs/no-empty-collection': 'error',
        'sonarjs/no-extra-arguments': 'error',
        'sonarjs/no-identical-conditions': 'error',
        'sonarjs/no-identical-expressions': 'error',
        'sonarjs/no-ignored-return': 'error',
        'sonarjs/no-inverted-boolean-check': 'error',
        'sonarjs/no-one-iteration-loop': 'error',
        'sonarjs/no-redundant-boolean': 'error',
        'sonarjs/no-redundant-jump': 'error',
        'sonarjs/no-same-line-conditional': 'error',
        'sonarjs/no-small-switch': 'error',
        'sonarjs/no-unused-collection': 'error',
        'sonarjs/no-use-of-empty-return-value': 'error',
        'sonarjs/no-useless-catch': 'error',
        'sonarjs/prefer-immediate-return': 'error',
        'sonarjs/prefer-object-literal': 'error',
        'sonarjs/prefer-single-boolean-return': 'error',
        'sonarjs/prefer-while': 'error'
    },
    overrides: [
        {
            files: ['*.test.js', '*.spec.js', 'tests/**/*.js'],
            rules: {
                'no-magic-numbers': 'off',
                'init-declarations': 'off',
                'no-undefined': 'off'
            }
        },
        {
            files: ['scripts/**/*.js'],
            rules: {
                'no-console': 'off',
                'no-process-exit': 'off'
            }
        },
        {
            files: ['security*.js', 'session-manager.js', 'performance-optimizer.js'],
            rules: {
                'no-magic-numbers': 'off',
                'sonarjs/cognitive-complexity': ['warn', 25] // Allow higher complexity for security modules
            }
        }
    ],
    globals: {
        // JuriBank platform globals
        'JuriBankCore': 'readonly',
        'JuriBankSecurity': 'readonly',
        'JuriBankSessionManager': 'readonly',
        'JuriBankPerf': 'readonly',
        'JuriBankSecurityMiddleware': 'readonly',
        
        // Browser globals
        'window': 'readonly',
        'document': 'readonly',
        'console': 'readonly',
        'crypto': 'readonly',
        'fetch': 'readonly',
        'performance': 'readonly',
        'IntersectionObserver': 'readonly',
        'PerformanceObserver': 'readonly',
        'Image': 'readonly'
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src', 'scripts', 'components']
            }
        }
    }
};