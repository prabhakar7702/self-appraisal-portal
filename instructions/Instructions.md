# Self Appraisal System - Codex Development Guidelines

## Overview

Build a clean, modern, responsive, and production-ready Self Appraisal System using:

* SPFx
* React
* TypeScript
* Fluent UI v9
* PnPjs
* SCSS Modules

The implementation must closely follow the provided UI mockups while maintaining high performance, maintainability, scalability, accessibility, and code quality.

---

# General Development Principles

## UI Requirements

* Use Fluent UI v9 components wherever possible.
* Maintain a clean enterprise HR application look and feel.
* Follow the provided mockups exactly.
* Keep the design minimal and professional.
* Use proper spacing, typography, shadows, borders, and Fluent UI design tokens.
* Fully responsive for:

  * Desktop
  * Laptop
  * Tablet
  * Mobile
* Ensure proper keyboard accessibility.
* Support screen readers where applicable.

---

# Folder Structure

Follow this structure strictly.

```text
src
│
├── components
│
│   ├── Home
│   │   ├── Home.tsx
│   │   ├── Home.module.scss
│   │   └── IHomeProps.ts
│
│   ├── GoalCreation
│   │   ├── GoalCreation.tsx
│   │   ├── GoalCreation.module.scss
│   │   └── IGoalCreationProps.ts
│
│   ├── SelfAppraisalForm
│   │   ├── SelfAppraisalForm.tsx
│   │   ├── SelfAppraisalForm.module.scss
│   │   └── ISelfAppraisalFormProps.ts
│
│   ├── AdditionalQuestions
│   │   ├── AdditionalQuestions.tsx
│   │   ├── AdditionalQuestions.module.scss
│   │   └── IAdditionalQuestionsProps.ts
│
│   ├── DocumentUpload
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentUpload.module.scss
│   │   └── IDocumentUploadProps.ts
│
│   ├── Layout
│   │   ├── Layout.tsx
│   │   ├── Layout.module.scss
│   │   └── ILayoutProps.ts
│
│   ├── Navigation
│   │   ├── Navigation.tsx
│   │   ├── Navigation.module.scss
│   │   └── INavigationProps.ts
│
│   ├── AppraisalSummary
│   │   ├── AppraisalSummary.tsx
│   │   ├── AppraisalSummary.module.scss
│   │   └── IAppraisalSummaryProps.ts
│
│   └── common
│       ├── Loader
│       ├── EmptyState
│       ├── ErrorMessage
│       ├── ConfirmationDialog
│       └── RatingControl
│
├── services
│   ├── EmployeeService.ts
│   ├── GoalService.ts
│   ├── AppraisalService.ts
│   ├── DocumentService.ts
│   ├── CycleService.ts
│   └── SharePointService.ts
│
├── constants
│   ├── ListNames.ts
│   ├── LibraryNames.ts
│   ├── Routes.ts
│   ├── AppConstants.ts
│   └── Messages.ts
│
├── models
│   ├── Employee.ts
│   ├── Goal.ts
│   ├── KRA.ts
│   ├── Appraisal.ts
│   └── Question.ts
│
├── hooks
│   ├── useEmployee.ts
│   ├── useGoals.ts
│   ├── useAppraisal.ts
│   └── useDebounce.ts
│
├── context
│   ├── AppContext.tsx
│   └── AppProvider.tsx
│
└── utils
    ├── ValidationHelper.ts
    ├── RatingHelper.ts
    ├── DateHelper.ts
    └── ErrorHelper.ts
```

---

# Component Rules

## Mandatory

Each component folder must contain:

```text
ComponentName
│
├── ComponentName.tsx
├── ComponentName.module.scss
└── IComponentNameProps.ts
```

Example:

```text
components/Home
│
├── Home.tsx
├── Home.module.scss
└── IHomeProps.ts
```

Never place props interfaces inside component files.

Never place styles inside component files.

---

# Styling Rules

## Strictly Prohibited

Do not use:

```tsx
style={{}}
```

Do not use:

```tsx
const styles = {
}
```

Do not use:

```tsx
makeStyles()
```

Do not use inline CSS anywhere.

---

## Required

All styling must reside inside:

```text
Component.module.scss
```

Use:

```tsx
className={styles.container}
```

only.

---

# Constants Management

Never hardcode SharePoint list names.

Create:

```typescript
ListNames.ts
```

Example:

```typescript
export const LISTS = {
  EmployeeData: "EmployeeData",
  KRAs: "KRAs",
  DesignationKRAMapping: "DesignationKRAMapping",
  EmployeeGoals: "EmployeeGoals",
  AppraisalResponses: "AppraisalResponses",
  AppraisalGoalResponses: "AppraisalGoalResponses",
  AppraisalQAResponses: "AppraisalQAResponses",
  AppraisalCycles: "AppraisalCycles"
};
```

---

Store document library names in:

```typescript
LibraryNames.ts
```

---

Store route names in:

```typescript
Routes.ts
```

---

Store messages in:

```typescript
Messages.ts
```

Never hardcode messages in components.

---

# Service Layer Rules

All SharePoint calls must be placed in:

```text
services/
```

Never call PnPjs directly inside components.

Wrong:

```tsx
sp.web.lists.getByTitle(...)
```

inside component.

Correct:

```tsx
GoalService.getGoals();
```

---

Services must:

* Handle exceptions
* Return typed responses
* Centralize SharePoint operations
* Use async/await
* Use batching when possible

---

# Error Handling

Every API call must be wrapped in:

```typescript
try {
}
catch(error){
}
```

Use centralized helper:

```typescript
ErrorHelper.ts
```

Display user-friendly messages.

Never expose:

```typescript
error.message
```

directly to users.

---

# Performance Optimization

## Avoid Unnecessary Re-renders

Use:

```typescript
React.memo()
```

for reusable components.

Use:

```typescript
useMemo()
```

for expensive calculations.

Use:

```typescript
useCallback()
```

for handlers.

---

## Avoid Duplicate API Calls

Load data once.

Cache lookup/master data where possible.

Examples:

* KRAs
* Designations
* Questions
* Appraisal Cycle

should not reload unnecessarily.

---

## Minimize State Updates

Avoid multiple sequential:

```typescript
setState()
```

calls.

Batch updates whenever possible.

---

## Conditional Rendering

Render heavy components only when needed.

Example:

* Goal Dialog
* Upload Dialog
* Confirmation Dialog

should load only when opened.

---

# Loading States

Every page must support:

* Loading
* Empty State
* Success State
* Error State

Use reusable components:

```text
Loader
EmptyState
ErrorMessage
```

---

# Form Validation

Validate:

* Required fields
* Goal creation
* Rating selection
* Comments
* Additional Questions
* File uploads

before save/submit.

Show validation messages near fields.

---

# File Upload

Support:

* PDF only

Validate:

* File type
* File size

Show:

* Upload progress
* Success state
* Error state

---

# Responsive Design

Use Fluent UI Grid/Flex layouts.

Breakpoints:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Requirements:

* Sidebar collapses on mobile.
* Tables become stacked cards on small screens.
* Buttons become full width on mobile.
* Avoid horizontal scrolling.

---

# Accessibility

Use:

* aria-label
* semantic HTML
* keyboard navigation

All inputs must have labels.

All buttons must have accessible names.

---

# Code Quality

Use:

* Strict TypeScript typing
* Interfaces for all models
* Reusable utility methods
* Small focused components

Keep component files under approximately 300 lines where possible.

Move reusable logic to:

```text
hooks/
services/
utils/
```

---

# Final Deliverable Expectations

Generate a production-ready SPFx solution with:

* Clean architecture
* Responsive Fluent UI design
* Reusable components
* Modular folder structure
* Strong typing
* Centralized services
* Centralized constants
* SCSS-only styling
* Optimized rendering
* Minimal API calls
* Robust error handling
* Enterprise-grade maintainability
