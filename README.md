# Bevel Games services

## Testing

Run `npm test` to test code with code coverage and preview results in the browser.

Resources: 
 - [Lab best practices](https://github.com/hapijs/lab#best-practices)

### Manual `make` command execution
- `make test` - runs minimal test
- `make test-cov` - runs test with required 100% code coverage
- `make test-cov-html` - same as test-cov but renders result to `coverage.html` file
- `make test-cov-html!` - same test-cov-html but opens browser as well *default test*