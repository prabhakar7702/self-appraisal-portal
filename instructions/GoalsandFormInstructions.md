# Codex Update Instructions - Goal Creation & Self Appraisal Enhancements

## Goal Creation Screen Updates

### Purpose

This screen should be used only for Goal Management.

Users should be able to:

* Create Goals
* Edit Goals
* Delete Goals
* View Goals

Do not allow appraisal-related activities on this screen.

---

## Remove Navigation to Self Appraisal Form

Remove:

```text
Continue to Form
Go to Appraisal
Start Self Appraisal
```

buttons from Goal Creation screen.

This page should be dedicated only to goal creation and maintenance.

---

## Goal Form Fields

When creating or editing a goal, include all fields from EmployeeGoals list.

### EmployeeGoals

| Field       | Required |
| ----------- | -------- |
| Goal        | Yes      |
| Description | Yes      |
| Priority    | Yes      |
| StartDate   | Yes      |
| DueDate     | Yes      |
| KRA         | Yes      |
| Progress    | Yes      |

---

## KRA Goal Requirements

Validation:

Each KRA must contain at least:

```text
3 Goals
```

before appraisal submission.

Show validation message:

```text
Every KRA must contain at least 3 goals before appraisal submission.
```

---

## Mandatory Goal

The following goal must exist for every employee regardless of designation.

KRA:

```text
Org or CoE Contributions
```

Mandatory Goal:

```text
Improving Presentation Skill
```

Rules:

* Auto-create if missing.
* User cannot delete this goal.
* User can update progress and comments.
* Show lock icon beside mandatory goal.

Example:

```text
🔒 Improving Presentation Skill
(Mandatory Organization Goal)
```

---

## Mid-Year Goal Due Date Validation

For Mid-Year Appraisal Cycle:

Due Date must be:

```text
10-Jun-2026
```

or earlier.

Validation:

```text
Due Date cannot be later than 10-Jun-2026 for Mid-Year Appraisal Goals.
```

Block save if validation fails.

---

## Goal Management Operations

Support:

### Create Goal

User can:

* Select KRA
* Enter Goal
* Enter Description
* Select Priority
* Select Start Date
* Select Due Date
* Enter Progress

---

### Edit Goal

User can update:

* Goal
* Description
* Priority
* Progress
* Start Date
* Due Date

---

### Delete Goal

Show confirmation popup.

Example:

```text
Delete Goal?

Are you sure you want to delete this goal?

[Cancel]
[Delete]
```

Do not allow deletion of mandatory goals.

---

## Success & Error Popups

Replace browser alerts.

Use Fluent UI Dialog / MessageBar / Toast style components.

Create reusable components:

```text
components/common/SuccessDialog
components/common/ErrorDialog
components/common/ConfirmationDialog
```

Examples:

### Success

```text
Goal saved successfully.
```

### Error

```text
Unable to save goal.

Please try again.
```

### Warning

```text
Mandatory goal cannot be deleted.
```

---

# Self Appraisal Form Updates

## Additional Questions Bug Fix

Current Issue:

Typing in one question clears values entered in other questions.

Fix:

* Maintain separate state for each question.
* Use Question ID as key.
* Ensure updates only affect selected question.

Example:

```typescript
{
  questionId: answer
}
```

Do not overwrite entire question collection during updates.

---

## File Attachment Fix

Current Issue:

File upload always shows:

```text
Unable to attach file.
```

Fix document upload implementation.

Requirements:

### Allowed Files

* PDF

### Validation

* File type validation
* File size validation

### Upload

Upload to:

```text
AppraisalDocuments
  └── Cycle
       └── EmpID
            └── Document
```

Example:

```text
AppraisalDocuments/CY2026/EMP001/Appraisal.pdf
```

---

## Uploaded File Features

Allow:

* Upload
* Replace
* Delete
* View

Display:

```text
File Name
Upload Date
File Size
```

---

## Goals Display in Self Appraisal Form

Load all goals created under each KRA.

Display:

### Goal Information

* Goal
* Description
* Priority
* Progress

### Appraisal Fields

* Self Rating
* Self Comments

Example:

```text
Goal:
Improve Presentation Skill

Description:
Improve presentation and communication skills.

Priority:
Medium

Progress:
75%

Self Rating:
★★★★☆

Self Comments:
Completed 3 internal presentations.
```

---

## Restrict Goal Management

Do NOT allow the following inside Self Appraisal Form:

* Add Goal
* Edit Goal
* Delete Goal

Goal management belongs only to Goal Creation screen.

The appraisal form should only allow:

* Update Progress
* Update Self Rating
* Update Self Comments

---

## Rating Calculations

Update KRA Rating dynamically.

Update Final Rating dynamically.

Recalculate when:

* Rating changes
* Progress changes

Use memoized calculations.

---

## Save Draft

Save:

* Goal Ratings
* Goal Comments
* Progress
* Additional Questions
* Uploaded Document

Status:

```text
Draft
```

---

## Submit Appraisal

Validate:

* Active appraisal window
* Minimum 3 goals under every KRA
* Mandatory goal exists
* Ratings completed
* Comments completed
* Questions completed

Then:

```text
Status = Submitted
```

Show success popup.

---

# Responsive Design Updates

Make all screens fully responsive.

---

## Mobile

320px+

Requirements:

* Sidebar collapses into hamburger menu.
* Tables become cards.
* Dialogs fit screen width.
* Buttons become full width.
* Forms stack vertically.

---

## Tablet

768px+

Requirements:

* Two-column layouts where possible.
* Responsive grids.
* Proper spacing.

---

## Desktop

1024px+

Requirements:

* Full dashboard layout.
* Sidebar navigation.
* Multi-column forms.

---

## General Responsive Requirements

Avoid:

* Horizontal scrolling
* Overflow issues
* Fixed-width containers

Use:

* Flexbox
* CSS Grid
* Fluent UI responsive components

---

# Performance Requirements

* Do not reload goals unnecessarily.
* Cache KRA and Question master data.
* Use React.memo for reusable components.
* Use useMemo for rating calculations.
* Use useCallback for event handlers.
* Avoid duplicate REST API calls.
* Refresh only affected sections after create/update/delete operations.

---

# Final Expected Behaviour

Goal Creation Screen

* Create Goals
* Edit Goals
* Delete Goals
* Mandatory Goal Enforcement
* Minimum 3 Goals per KRA Validation
* Responsive Design
* Success/Error Popups

Self Appraisal Form

* View Goal Details
* Update Progress
* Update Self Rating
* Update Self Comments
* Additional Questions Working Properly
* File Upload Working Properly
* Save Draft
* Submit
* Responsive Design
* Success/Error Popups