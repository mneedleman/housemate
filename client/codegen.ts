import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:3000/graphql',
    documents: ["src/graphql/**/*.gql"],
    generates: {
        "./src/__generated__/types.ts": {
            plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
            config: {
                // TS `enum`s aren't allowed under erasableSyntaxOnly (tsconfig.app.json)
                enumsAsTypes: true,
            },
        }
    }
};

export default config;
