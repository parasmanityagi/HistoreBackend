import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'User API for managing users',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
