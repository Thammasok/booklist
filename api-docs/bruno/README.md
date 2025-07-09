# Booklist API Documentation with Bruno

This directory contains Bruno collection files for testing and documenting the Booklist API.

## Prerequisites

1. Install [Bruno](https://www.usebruno.com/)
2. Clone this repository

## Getting Started

1. Open Bruno
2. Click on "Import" and select the `Booklist` folder from this directory
3. The collection will be imported with all the API endpoints

## Environment Setup

1. In Bruno, navigate to the "Environments" tab
2. Select "local" environment
3. Update the environment variables as needed:
   - `base_url`: Base URL for the API (default: http://localhost:3100/api/v1)
   - `token`: JWT token for authenticated requests (will be set after login)
   - Test user credentials

## Using the Collection

1. **Authentication**
   - Start with the "Register User" request to create a new account
   - Use the "Login User" request to get a JWT token
   - The token will be automatically saved to the environment variables for subsequent requests

2. **API Endpoints**
   - All endpoints are organized by category (Authentication, User, Admin, etc.)
   - Click on any request to see its details and make API calls

3. **Testing**
   - Use the "Tests" tab to write and run tests for each request
   - Tests can validate response status, body, headers, etc.

## Notes

- The collection includes examples for all available API endpoints
- Environment variables are used to store reusable values like tokens and base URLs
- Update the environment variables according to your local setup

## Contributing

To update the API documentation:

1. Make changes to the `.bru` files
2. Test the changes in Bruno
3. Commit and push the updated files
