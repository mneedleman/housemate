import type { CodegenConfig } from '@graphql-codegen/cli';

// Generates a typed `XDocument` for each operation in src/graphql. Use them with Apollo's own hooks:
//   useQuery(TimelineItemsDocument)  /  useMutation(LoginDocument)
// and the result/variable types are inferred.
//
// Run against the dev API:  npm run compile
// Inside the docker-compose client container, the API is at http://api:3000 instead:
//   GRAPHQL_SCHEMA_URL=http://api:3000/graphql npm run compile
const config: CodegenConfig = {
    schema: process.env.GRAPHQL_SCHEMA_URL ?? 'http://localhost:3000/graphql',
    documents: ["src/graphql/**/*.gql"],
    generates: {
        "./src/__generated__/types.ts": {
            plugins: ["typescript-operations", "typed-document-node"],
            config: {
                // TS `enum`s aren't allowed under erasableSyntaxOnly (tsconfig.app.json)
                enumsAsTypes: true,
                scalars: {
                    ISO8601DateTime: "string",
                    // The API's only JSON fields are login/signup, which return { token }
                    JSON: "{ token?: string | null }",
                },
            },
        }
    }
};

export default config;
