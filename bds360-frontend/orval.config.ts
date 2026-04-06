export default {
    'bds360-api': {
        input: 'http://localhost:8080/v3/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/api/generated',
            client: 'react-query',
            override: { mutator: { path: 'src/lib/custom-fetch.ts', name: 'customFetch' } },
            clean: true,
        },
    },
};