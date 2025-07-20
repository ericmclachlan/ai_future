A pull request has been submitted. Now, please use `git --no-pager diff $(git merge-base main HEAD)..HEAD -- . ':(exclude)poetry.lock'` to see what changes are included in this PR.

A code reviewer will read this to contextualize the code changes and assess whether the code is ready for production.

Generate a minimal GitHub PR description with ### headings for the following:
- Issue: $ISSUE_NUMBER (Included only if the issue number is included in the branch name.)
- "Description" (Explain as briefly as possible the essence of the PR.)
- "Changes" (Explain in bullet point format the most salient changes. Omit additions to the dictionary, linting changes, and non-background changes)
- "Why" (Explain the most salient changes in bullet point format. Explain the reason that this PR adds value. What is the value to the client?).
- "Risks" (Optional: If there are any material risks, you may draw attention to it here in bullet point format.)
- "Other" (Optional: Explain any other aspects of the PR that are necessary to understand why this change is being made in bullet point format.)
- "Testing" (When applicable, describe anything we've done here in the conversation and in the terminal for testing purposes.)

No not include low-information value changes: Adding words to the dictionary, linting changes, etc.
Be succinct.
Prefer to omit optional sections unless there's a good reason to include them.
Please do not include a preamble in your response.
Print the output in markdown format.
