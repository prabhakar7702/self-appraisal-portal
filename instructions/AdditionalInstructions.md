# Additional Instructions for Codex

Implement the following changes and enhancements in the existing SPFx Self Appraisal application.

---

## 1. Make the Application Fully Responsive

Refactor all pages and components to be fully responsive across:

* Mobile Phones
* Tablets
* Laptops
* Desktop Monitors

### Requirements

* Use Fluent UI responsive layouts.
* Avoid horizontal scrolling.
* Sidebar should collapse into a hamburger menu on mobile devices.
* Tables should transform into stacked card layouts on smaller screens.
* Buttons should become full-width where appropriate on mobile.
* Forms should use responsive grid layouts.
* File upload sections should stack vertically on smaller devices.
* Test responsiveness at:

  * 320px
  * 768px
  * 1024px
  * 1440px

---

## 2. Remove All Static Data

Remove all hardcoded/mock/static data currently present in the application.

### Requirements

All data must be loaded dynamically from SharePoint:

* EmployeeData
* KRAs
* EmployeeGoals
* AppraisalResponses
* AppraisalGoalResponses
* AppraisalQAResponses
* AppraisalCycles
* AppraisalDocuments

### Validation

There should be:

* No hardcoded KRAs
* No hardcoded goals
* No hardcoded employee information
* No hardcoded questions
* No hardcoded appraisal cycle information

---

## 3. Convert Self Appraisal Into a Multi-Section Form

Remove separate pages/components for:

* Self Appraisal Form
* Additional Questions
* Upload Documents

Combine them into a single multi-section form.

### Form Sections

#### Section 1

Employee Information

* Employee Details
* Designation
* Department
* Appraisal Window Status

---

#### Section 2

KRA Ratings & Goal Reviews

For each goal:

* Goal Title
* Goal Progress
* Self Rating
* Self Comments

---

#### Section 3

Additional Questions

Load questions dynamically from SharePoint.

Allow users to answer all configured questions.

---

#### Section 4

Supporting Documents

* Upload PDF
* Replace PDF
* Remove PDF
* Show uploaded document

---

#### Section 5

Summary & Submission

Display:

* KRA Ratings
* Final Self Rating
* Validation Status

Actions:

* Save Draft
* Submit

---

## 4. Redesign Home Page

Replace current Home Page with a single Appraisal Dashboard Card.

### Card should display

* Employee Name
* Designation
* Appraisal Cycle Name
* Window Start Date
* Window End Date
* Current Status
* Completion Percentage
* Goals Created Count
* Goals Rated Count
* Final Rating (if available)

---

### Draft Scenario

If a Draft Appraisal exists:

Display:

* Draft Status
* Last Saved Date

Action Button:

```text
Continue Appraisal
```

Opening the button should open the multi-section form in Edit Mode.

---

### Submitted Scenario

If Appraisal is Submitted:

Display:

* Submitted Status
* Submitted Date

Action Button:

```text
View Appraisal
```

Opening the button should open the multi-section form in Read-Only Mode.

No editing should be allowed.

---

### No Appraisal Scenario

Display:

```text
Start Appraisal
```

Only if appraisal window is active.

---

## 5. Remove Generic Services

Remove all generic service implementations.

Examples:

```typescript
BaseService<T>
IRepository<T>
GenericRepository<T>
```

Do not use generic service patterns.

---

### Create Dedicated Services

Implement separate services:

```text
services/
│
├── EmployeeService.ts
├── GoalService.ts
├── AppraisalService.ts
├── QuestionService.ts
├── CycleService.ts
├── DocumentService.ts
└── SharePointRestService.ts
```

Each service should contain only business logic related to its domain.

---

## 6. Replace PnPjs with SharePoint REST API

Do not use:

```typescript
@pnp/sp
```

Remove all PnPjs dependencies.

---

### Use SharePoint REST API

Use:

```typescript
/_api/web/lists
/_api/web/GetFolderByServerRelativeUrl
/_api/web/GetFileByServerRelativeUrl
```

for all operations.

---

### Required Operations

Implement REST API methods for:

#### Read

* Employee Data
* KRAs
* Designation KRAs
* Goals
* Appraisal Headers
* Goal Responses
* Additional Questions
* Documents

#### Create

* Goals
* Appraisal Headers
* Goal Responses
* Question Responses
* Documents

#### Update

* Goals
* Goal Progress
* Ratings
* Comments
* Draft Appraisals

#### Delete

* Goals
* Uploaded Documents

---

## 7. Goal Creation Screen Enhancements

Enhance Goal Creation functionality.

### Supported Operations

#### Create Goal

User can:

* Select KRA
* Enter Goal Title
* Enter Goal Description
* Select Priority
* Enter Target Outcome

Save Goal

---

#### Edit Goal

User can:

* Modify Goal Title
* Modify Description
* Modify Priority
* Modify Target Outcome

Save Changes

---

#### Delete Goal

User can:

* Delete Goal

Show confirmation dialog before deletion.

---

### Validation Rules

* Goal Title required
* Priority required
* KRA required

---

### Submission Rule

Before submitting appraisal:

Every KRA must contain at least one active goal.

If not:

```text
At least one goal is required under every KRA before submission.
```

Block submission.

---

## 8. Performance Optimization

Reduce unnecessary renders and API calls.

### Requirements

* Use React.memo where applicable.
* Use useMemo for computed values.
* Use useCallback for event handlers.
* Cache lookup/master data.
* Avoid duplicate REST calls.
* Load only required data.
* Batch updates where possible.
* Use lazy loading for large sections.
* Prevent unnecessary state updates.

---

## 9. Error Handling

Implement robust error handling.

### Requirements

* Centralized error handling utility.
* Friendly user messages.
* Retry support for failed requests.
* Loading states.
* Empty states.
* Error states.

Never expose raw API errors to end users.

---

## 10. UI Expectations

Maintain a simple and beautiful enterprise UI.

### Design Goals

* Clean Fluent UI design
* Minimalistic layout
* Modern cards
* Proper spacing
* Consistent typography
* Accessible components
* Responsive behavior
* Professional HR application appearance

Avoid overengineering, excessive animations, unnecessary components, and overly complex layouts.