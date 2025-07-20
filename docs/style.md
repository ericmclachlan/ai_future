# Slide Styling Guide

This document defines the styling conventions for presentation slides in this project.

## File Naming Convention

Slides follow the pattern: `{number}.00 - {short title} - {presenter|audience}.md`

- `{number}`: Auto-incrementing slide number (e.g., 01, 02, 03)
- `{short title}`: Brief descriptive title
- `{presenter|audience}`: Indicates the target view

**Example:** `03.00 - Software Engineer Profile - presenter.md`

## Markdown Formatting Standards

### Headers
- Use `#` for main slide title
- Use `##` for section headers within slides
- Use `###` sparingly for subsections

### Emphasis
- Use **bold** for key terms, concepts, and important numbers
- Use *italic* for quotes and emphasis
- Use `code formatting` for technical terms when appropriate

### Blockquotes
Use `>` for important quotes and key statements:

```markdown
> "This is an important quote that should stand out."
```

### Lists
- Use `-` for bullet points
- Use `1.` for numbered lists when order matters
- Indent sub-bullets with 2 spaces

### Visual Separation
Use horizontal rules (`---`) to separate major sections:

```markdown
## Section 1
Content here

---

## Section 2
Content here
```

## Content Structure

### Presenter Slides
- Include **Presenter Notes** section with action items
- Provide detailed context and talking points
- Include quotes and references
- Add **Relevance** or **Key Point** sections

### Audience Slides
- Keep content concise and focused
- Use clear, scannable formatting
- Include key questions for engagement
- End with horizontal rule and call-to-action when appropriate

## Styling Examples

### Good Formatting
```markdown
# Slide Title

## Section Header
- **Bold key terms** for emphasis
- Clear, concise bullet points
- Proper spacing between elements

---

## Another Section
> "Important quote that stands out"

**Key Point:** Summary statement
```

### Avoid
- Overuse of emphasis (too much bold text)
- Inconsistent formatting
- Long paragraphs without visual breaks
- Missing section headers

## Best Practices

1. **Consistency**: Use the same formatting patterns across all slides
2. **Readability**: Prioritize clear, scannable content
3. **Emphasis**: Use bold sparingly for maximum impact
4. **Spacing**: Include adequate whitespace for visual breathing room
5. **Hierarchy**: Use headers to create clear information hierarchy
6. **Quotes**: Use blockquotes for important statements and quotes
7. **Separation**: Use horizontal rules to separate major sections

## Technical Notes

- Slides are loaded dynamically using Vite's `import.meta.glob`
- Files are sorted numerically by the number prefix
- Both presenter and audience versions are loaded for each slide
- Markdown is rendered using `react-markdown` 