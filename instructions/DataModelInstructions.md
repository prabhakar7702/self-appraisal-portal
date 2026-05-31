Updated Relationships
EmployeeData (1)
    |
    | Employee
    |
    v
AppraisalResponses (Many)
    |
    +--------------------------+
    |                          |
    v                          v
AppraisalGoalResponses     AppraisalQAResponses
    |
    |
    v
EmployeeGoals
    |
    |
    v
KRAs
    |
    |
    v
Designations

AppraisalCycles
    |
    |
    +------> AppraisalResponses

AppraisalDocuments Library
    |
    └── Cycle
          └── EmpID
                └── PDF Documents
Updated SharePoint Lists
1. EmployeeData
Column	Type
ID	Number (PK)
EmpID	Single Line Text
FirstName	Single Line Text
LastName	Single Line Text
Email	Single Line Text
Designation	Single Line Text
ReportingManager	Person
Department	Choice
BusinessUnit	Choice
DateOfJoining	Date
2. Designations
Column	Type
ID	Number (PK)
Title	Single Line Text

Examples:

Software Engineer
Senior Software Engineer
Technical Lead
Project Manager
3. KRAs
Column	Type
ID	Number (PK)
Title	Single Line Text
Designation	Lookup(Designations)
Weightage	Number

Example:

Senior Software Engineer
KRA	Weightage
Technical Delivery	40
Code Quality	30
Process Improvement	20
Behaviour & Process Adherence	10
4. AppraisalCycles
Column	Type
ID	Number (PK)
Cycle	Single Line Text
StartDate	Date
EndDate	Date
Status	Choice

Choice Values:

Active
Closed
5. AppraisalResponses

This becomes the main parent record.

Column	Type
ID	Number (PK)
Employee	Lookup(EmployeeData)
Cycle	Lookup(AppraisalCycles)
Status	Choice
FinalRating	Number
SubmittedOn	Date

Choice Values:

Draft
Submitted

Example:

Prabhakar
CY2026
Draft
4.2
6. EmployeeGoals

Goals created by employee.

Column	Type
ID	Number (PK)
Goal	Single Line Text
Description	Multiple Lines
Priority	Choice
StartDate	Date
DueDate	Date
KRA	Lookup(KRAs)
Progress	Number

Priority Values:

High
Medium
Low
7. AppraisalGoalResponses

Stores employee ratings/comments for each goal.

Column	Type
ID	Number (PK)
AppraisalResponse	Lookup(AppraisalResponses)
Goal	Lookup(EmployeeGoals)
SelfRating	Number
SelfComments	Multiple Lines

Example:

Goal:
Improve SPFx Performance

Rating:
4

Comments:
Successfully optimized bundle size.
8. AppraisalQAResponses

Stores responses to additional questions.

Column	Type
ID	Number (PK)
AppraisalResponse	Lookup(AppraisalResponses)
Question	Single Line Text
Answer	Multiple Lines

Example:

Question:
What are your key achievements?

Answer:
Delivered Self Appraisal Portal.
9. AppraisalDocuments Library
Library Structure
AppraisalDocuments
|
├── CY2026
│
├── EMP001
│   ├── SelfAppraisal.pdf
│   └── Achievements.pdf
│
└── EMP002
    └── SelfAppraisal.pdf

Folder Structure:

{Cycle}/{EmpID}/{Document}

Example:

CY2026/EMP001/AppraisalDocument.pdf
Rating Calculation Logic
Step 1

Calculate KRA Rating

Average(SelfRating of Goals under KRA)
Step 2

Apply KRA Weightage

Final Rating =
Σ (KRA Rating × KRA Weightage)
/ 100

Example:

KRA	Weightage	Rating
Technical Delivery	40	4.5
Code Quality	30	4
Process Improvement	20	5
Behaviour	10	4
(4.5×40)+(4×30)+(5×20)+(4×10)
--------------------------------
100

= 4.4
Phase-1 Flow
1. Employee opens Home Page

2. System checks Active Appraisal Cycle

3. System loads Employee Details

4. System loads KRAs based on Designation

5. Employee creates Goals under KRAs

6. Employee opens Self Appraisal Form

7. Employee updates:
   - Goal Progress
   - Rating
   - Comments

8. Employee answers Additional Questions

9. Employee uploads PDF

10. Save Draft or Submit

11. Final Rating calculated

12. Data stored in:
    - AppraisalResponses
    - AppraisalGoalResponses
    - AppraisalQAResponses
    - AppraisalDocuments





New List: AppraisalQuestions
Column	Type
ID	Number (PK)
Question	Multiple Lines Text
Example Records
ID	Question
1	What are your key achievements during this appraisal period?
2	What were the major challenges you faced?
3	What are your priorities for the next appraisal period?
4	What support or resources do you need from your manager or organization?
Updated Relationship
AppraisalQuestions (Master)
          |
          | Question Text
          |
          ▼

AppraisalQAResponses
          |
          |
          ▼

AppraisalResponses
Updated AppraisalQAResponses

Instead of storing only free-text questions, store a lookup to the master question.

Recommended Structure
Column	Type
ID	Number (PK)
AppraisalResponse	Lookup(AppraisalResponses)
Question	Lookup(AppraisalQuestions)
Answer	Multiple Lines Text

This provides:

✅ Dynamic question management

✅ HR can add/remove questions without code changes

✅ Questions can be reused across appraisal cycles

✅ Better reporting and analytics

Updated Data Model
EmployeeData
      |
      ▼
AppraisalResponses
      |
      ├───────────────┐
      ▼               ▼
AppraisalGoalResponses    AppraisalQAResponses
      |                        |
      ▼                        ▼
EmployeeGoals         AppraisalQuestions

EmployeeGoals
      |
      ▼
KRAs
      |
      ▼
Designations

AppraisalCycles
      |
      ▼
AppraisalResponses

AppraisalDocuments Library