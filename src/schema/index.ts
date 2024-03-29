import * as SchemaJSON from './schema.json';

import { OpenAPIV3 } from 'openapi-types';

export const getServers = () => {
    if (process.env.NODE_ENV === 'production') {
        return [
            {
                url: 'https://www.benweare.co.uk/',
                description: 'Production Build',
            },
        ];
    }
    return [
        {
            url: !process.env.PORT
                ? 'http://localhost/'
                : `http://localhost:${process.env.PORT}`,
            description: 'Local build',
        },
        {
            url: 'https://benweare-dev.herokuapp.com/',
            description: 'Heroku-Dev',
        },
        {
            url: 'http://dev.benweare.co.uk/',
            description: 'Heroku-Dev',
        },
    ];
};

const OpenApiSchema = SchemaJSON as OpenAPIV3.Document;
OpenApiSchema.info.version = process.env.npm_package_version as string;
OpenApiSchema.servers = getServers();
export default OpenApiSchema;
