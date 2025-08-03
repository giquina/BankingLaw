---
name: update-docs
description: Automatically update project documentation including README, TODO, and agent documentation
tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Grep
  - Glob
  - LS
---

# Update Documentation Command

This command automatically updates all project documentation to ensure consistency across the JuriBank platform.

## What it updates:

### Core Documentation
- **README.md** - Project overview, setup instructions, and architecture
- **TODO.md** - Current tasks, priorities, and development roadmap
- **CLAUDE.md** - Claude Code usage guidelines and best practices

### Agent Documentation
- **Agent Files** - Updates all 5 specialist agents with latest capabilities
- **Agent Index** - Maintains current list of available agents
- **Context Files** - Updates Claude context and memory files

### Technical Documentation
- **package.json** - Dependencies and project metadata
- **tailwind.config.js** - Brand colors and styling configuration
- **manifest.json** - PWA capabilities and metadata

## Usage:
```
/update-docs
```

## Automatic Updates Include:
1. **Version Bumping** - Increments version numbers where appropriate
2. **Date Stamps** - Updates "Last Modified" dates
3. **Feature Status** - Synchronizes completed/pending tasks
4. **Brand Consistency** - Ensures JuriBank branding throughout
5. **Technical Accuracy** - Validates technical specifications

## Quality Checks:
- Validates all markdown syntax
- Checks for broken internal links
- Ensures consistent terminology
- Verifies agent YAML frontmatter
- Confirms brand guideline compliance

This command maintains documentation quality and ensures all team members have access to current, accurate information about the JuriBank platform.