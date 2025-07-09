import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import { specs } from './swagger.js';

// Get the current file and directory paths in a way that works with both ESM and CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the output file path
const outputFile = path.join(__dirname, '../../openapi.json');

// Write the OpenAPI spec to a file
fs.writeFileSync(outputFile, JSON.stringify(specs, null, 2));
console.log(`OpenAPI specification written to ${outputFile}`);
