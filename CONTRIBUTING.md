# Contributing Guide

Thank you for considering contributing to the Image Upload & Payment System!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Use interfaces for object shapes

### Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Code Formatting
- Use Prettier for formatting
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

## Project Structure

```
apps/
├── backend/          # Express API
├── frontend/         # Next.js app
├── mcp-server/       # MCP tool server
└── ai-agent/         # AI orchestration
```

## Making Changes

### Backend Changes

1. **Add new endpoint:**
   - Create route in `apps/backend/src/routes/`
   - Add authentication middleware
   - Validate input with Zod
   - Update API documentation

2. **Database changes:**
   - Update Prisma schema
   - Create migration: `npx prisma migrate dev`
   - Update types

### Frontend Changes

1. **Add new page:**
   - Create in `apps/frontend/src/app/`
   - Use Mantine components
   - Add loading states
   - Handle errors

2. **Add new component:**
   - Create in `apps/frontend/src/components/`
   - Make it reusable
   - Add TypeScript types

### MCP Server Changes

1. **Add new tool:**
   - Define in `apps/mcp-server/src/tools/`
   - Add handler in `toolHandler.ts`
   - Update tool list
   - Document usage

### AI Agent Changes

1. **Add new agent:**
   - Create in `apps/ai-agent/src/agents/`
   - Define system prompt
   - Add to orchestrator
   - Test with all providers

## Testing

### Manual Testing
- Test all user flows
- Test with different roles
- Test error cases
- Test on different browsers

### Future: Automated Testing
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright

## Pull Request Process

1. **Before submitting:**
   - Test your changes
   - Update documentation
   - Follow code style
   - No console.logs in production code

2. **PR Description:**
   - Describe what changed
   - Why the change was needed
   - How to test it
   - Screenshots if UI change

3. **Review process:**
   - Address review comments
   - Keep commits clean
   - Squash if needed

## Commit Messages

Follow conventional commits:

```
feat: add user profile page
fix: resolve image upload bug
docs: update API documentation
style: format code with prettier
refactor: simplify auth logic
test: add user service tests
chore: update dependencies
```

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Updating setup process
- Adding dependencies

Files to update:
- `README.md` - Overview
- `SETUP.md` - Setup instructions
- `API_DOCUMENTATION.md` - API changes
- `ARCHITECTURE.md` - Architecture changes

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
