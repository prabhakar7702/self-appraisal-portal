# Codex Agent - Critical Fixes & Enhancements

Implement the following changes in the existing SPFx Self Appraisal application.

---

# 1. Home Screen

## Appraisal Button Navigation

Currently, the Appraisal button does not navigate correctly.

### Expected Behavior

When user clicks:

```text
Self Appraisal
```

the application should navigate to:

```text
Self Appraisal Form Screen
```

### Validation

Before opening the form:

* Check active appraisal cycle.
* Check appraisal window.
* Check if employee has created minimum required goals.

If validations fail, show proper error popup.

---

# 2. Goal Creation Screen

## Fix Add Goal Behavior

### Current Issue

When user clicks:

```text
Add Goal
```

the goal is immediately added to the UI.

This is incorrect.

### Expected Behavior

Add Goal should:

1. Open Goal Form.
2. User enters data.
3. User clicks Save Goal.
4. Validate data.
5. Save to SharePoint EmployeeGoals list.
6. Refresh Goal Grid.

Only after successful save should the goal appear.

---

## Goal CRUD Operations

All Goal operations must use SharePoint EmployeeGoals list.

### Create

Write to:

```text
EmployeeGoals
```

### Update

Update:

```text
EmployeeGoals
```

### Delete

Delete from:

```text
EmployeeGoals
```

### Important

Remove all temporary state-only persistence.

Remove:

```text
mock data
temporary collections
session-only storage
local arrays used as source of truth
```

EmployeeGoals SharePoint list must be the single source of truth.

---

## Mandatory Goal Validation

Mandatory Goal:

```text
Improving Presentation Skill
```

KRA:

```text
Org or CoE Contributions
```

### Rules

If goal does not exist:

* Auto-create OR
* Block submission with validation message.

Mandatory goal:

* Cannot be deleted.
* Can be edited.
* Can update progress.

Show lock icon.

---

## Due Date Validation

Remove all references to:

```text
Mid-Year
Mid-Year Cycle
Mid-Year Goals
```

These should not appear anywhere in UI.

### Validation Rule

Goal Due Date must be:

```text
10-Jun-2026
```

or earlier.

Error:

```text
Due Date cannot be later than 10-Jun-2026.
```

---

## Minimum Goal Validation

Every KRA must contain:

```text
Minimum 3 Goals
```

Validation must execute:

* During Save Goal
* During Form Load
* During Save Draft
* During Submit

Show friendly popup if validation fails.

---

# 3. Self Appraisal Form Screen

## Form Enablement Validation

### Current Issue

Users can access form without creating goals.

### Expected Behavior

Before enabling form:

Validate:

```text
Each KRA has at least 3 Goals
```

If validation fails:

Disable:

* Ratings
* Comments
* Questions
* Save Draft
* Submit

Show banner:

```text
Please create at least 3 goals under each KRA before starting your appraisal.
```

Add button:

```text
Go To Goal Creation
```

---

## Goals Display

Load all goals dynamically from:

```text
EmployeeGoals
```

Group by:

```text
KRA
```

Display:

* Goal
* Description
* Priority
* Progress

Allow updates only for:

* Progress
* Self Rating
* Self Comments

Do NOT allow:

* Add Goal
* Edit Goal
* Delete Goal

inside appraisal form.

---

## Completion Percentage Fix

### Current Issue

Completion percentage is incorrect.

### Expected Calculation

Completion should consider:

#### Goals Section

Percentage of goals having:

* Progress
* Rating
* Comments

#### Additional Questions

Percentage of answered questions.

#### Documents

Document uploaded.

#### Overall

Formula:

```text
Completed Items
------------------- × 100
Total Required Items
```

Recalculate dynamically.

Update:

```text
Progress Bar
Completion %
```

immediately after changes.

---

# 4. Save Draft Functionality

## Current Issue

Save Draft does nothing.

### Expected Behavior

When Save Draft is clicked:

Create or Update:

```text
AppraisalResponses
```

Status:

```text
Draft
```

Persist:

* Progress
* Ratings
* Comments
* Questions
* Uploaded Documents

Show:

```text
Draft saved successfully.
```

---

# 5. Submit Functionality

## Current Issue

Submit does not persist data correctly.

### Expected Behavior

Before Submit:

Validate:

* Active appraisal window
* Minimum 3 goals per KRA
* Mandatory goal exists
* Ratings completed
* Comments completed
* Questions completed

If validation passes:

Update:

```text
AppraisalResponses.Status = Submitted
```

Set:

```text
SubmittedOn
```

Store FinalRating.

Show:

```text
Self Appraisal submitted successfully.
```

---

# 6. SharePoint Data Persistence

## AppraisalResponses

Create or Update:

```text
AppraisalResponses
```

Fields:

```text
Employee
Cycle
Status
FinalRating
SubmittedOn
```

---

## AppraisalGoalResponses

Create or Update:

```text
AppraisalGoalResponses
```

Fields:

```text
AppraisalResponse
Goal
SelfRating
SelfComments
```

---

## AppraisalQAResponses

Create or Update:

```text
AppraisalQAResponses
```

Fields:

```text
AppraisalResponse
Question
Answer
```

---

## EmployeeGoals

Create / Update / Delete:

```text
EmployeeGoals
```

Fields:

```text
Goal
Description
Priority
StartDate
DueDate
KRA
Progress
```

---

# 7. File Upload Fix

## Current Issue

Upload fails.

Attached files do not appear.

Error message:

```text
Unable to attach file
```

---

## Required Fix

Upload document to:

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

## After Upload

Display:

* File Name
* File Size
* Upload Date

Allow:

* Download
* Replace
* Delete

Persist document metadata.

---

## Existing Files

When form loads:

Fetch documents from library.

Display previously uploaded files automatically.

---

# 8. SharePoint REST API

Use SharePoint REST API only.

Do not use:

```text
Temporary state persistence
Mock repositories
Local collections
```

All Create/Update/Delete operations must persist immediately to SharePoint.

Implement dedicated methods:

```text
GoalService
AppraisalService
QuestionService
DocumentService
```

---

# 9. Error & Success Messages

Replace all browser alerts.

Use Fluent UI dialogs/toasts.

Success Examples:

```text
Goal saved successfully.
Goal updated successfully.
Draft saved successfully.
Appraisal submitted successfully.
Document uploaded successfully.
```

Error Examples:

```text
Please create at least 3 goals under each KRA.
Due Date cannot be later than 10-Jun-2026.
Unable to upload document.
Please answer all required questions.
```

Use consistent styling matching the existing UI theme.

---

# 10. Final Expected Behavior

### Home Screen

* Self Appraisal card navigates to Form Screen.

### Goal Screen

* Create Goal
* Update Goal
* Delete Goal
* EmployeeGoals as source of truth
* Mandatory Goal Validation
* Due Date Validation
* Minimum 3 Goals Validation

### Form Screen

* Disabled until goals criteria met
* Dynamic completion %
* Save Draft working
* Submit working
* Documents working
* Questions working
* Data persisted to SharePoint

### Persistence

All data must be stored and retrieved from:

```text
EmployeeGoals
AppraisalResponses
AppraisalGoalResponses
AppraisalQAResponses
AppraisalDocuments
```

No temporary or mock storage should remain in the application