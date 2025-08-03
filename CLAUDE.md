# Claude Code Operating Rules for BankingLaw Project

## Core Working Principles

### 1. Plan-First Approach
- First think through the problem thoroughly
- Read the codebase for relevant files and context
- Write a comprehensive plan to `tasks/todo.md`
- The plan should have a list of todo items that can be checked off as completed

### 2. Collaboration & Verification  
- Before beginning work, check in with the user to verify the plan
- Get approval before executing major changes
- Maintain clear communication throughout the process

### 3. Incremental Progress
- Begin working on todo items systematically
- Mark tasks as complete as you progress through them
- Give high-level summaries of changes made at each step
- Track progress transparently using the TodoWrite tool

### 4. Code Quality Standards
- Make every code/task change as simple as humanly possible
- Avoid broad refactors unless absolutely necessary
- Minimize the code impact of every change
- Simplicity always wins over complexity

### 5. Excellence Standards
- **DO NOT BE LAZY. NO HALF FIXES.**
- Find the root cause and fix it properly
- Complete every task thoroughly
- Never leave work in a broken or incomplete state

### 6. Documentation & Review
- Add a review section to `todo.md` summarizing completed work
- Keep all documentation updated and accurate
- Maintain clear project structure and organization

## Available Slash Commands

### `/update-docs`
Automatically updates all documentation across the project:
- Scans latest codebase changes
- Updates all README.md files  
- Refreshes CLAUDE.md with latest rules
- Synchronizes anything inside `/docs/`
- Keeps documentation in sync with code changes

### `/project-health`
Provides comprehensive project status overview:
- Count of remaining tasks in `todo.md`
- Number of commits made recently
- Files changed today
- Unresolved bugs listed in `errors/debug.log`
- Claude's assessment of current repository state
- Overall project health summary

## Project-Specific Guidelines

### Banking Law Requirements
- **Accuracy is non-negotiable** - Banking law is heavily regulated
- All legal content must be reviewed for accuracy
- UK regulatory compliance focus (PRA, FCA, Bank of England)
- Maintain professional legal terminology throughout
- Source all regulatory information from authoritative sources

### File Structure Conventions
```
/src/          - Source code and main application files
/tests/        - All test files and test utilities  
/docs/         - Project documentation and guides
/claude/       - Claude AI configuration and subagents
/tasks/        - Project task tracking and todo management
/errors/       - Error logs and debugging information
/scripts/      - Build scripts and utility automation
```

### Development Workflow
1. **Research Phase** - Understand requirements and existing code
2. **Planning Phase** - Create detailed todo list in `tasks/todo.md`
3. **Approval Phase** - Get user verification before proceeding
4. **Implementation Phase** - Execute tasks incrementally
5. **Review Phase** - Document changes and update todos
6. **Testing Phase** - Verify all functionality works correctly

### Git & Version Control
- Commit changes only when code executes without errors
- Use descriptive commit messages
- Include Claude Code attribution in commits
- Never commit broken or incomplete code
- Auto-commit hook validates code before committing

## Subagent Integration

The project utilizes specialized AI subagents for different aspects of banking law:

- **Regulatory Compliance Agent** - UK banking regulations expert
- **Securities Law Agent** - FCA, capital markets specialist  
- **FinTech Innovation Agent** - Digital assets, payments, emerging tech
- **AML/BSA Compliance Agent** - Anti-money laundering expert
- **Risk Management Agent** - Operational, credit, regulatory risk counsel

## Context Memory

Claude maintains project context through:
- `claude/context.json` - File structure and key functions
- `tasks/todo.md` - Current project status and priorities
- `errors/debug.log` - Historical issues and resolutions
- Regular documentation updates via `/update-docs`

## Success Metrics

- **Legal Accuracy**: 99.5%+ accuracy rate for all legal content
- **Response Time**: <24 hours for regulatory change updates  
- **Code Quality**: Zero broken builds, clean commit history
- **Task Completion**: 100% completion rate for planned todos
- **Documentation**: Always current and comprehensive

---

**Last Updated**: Initial setup - Banking Law platform with UK regulatory focus
**Version**: 1.0
**Maintained by**: Claude Code AI Assistant