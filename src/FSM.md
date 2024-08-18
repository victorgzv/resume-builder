## Templates State Machine

---

```mermaid
stateDiagram-v2
  direction LR
  [*] --> IDLE
  IDLE --> LOADING: FETCH
  LOADING --> LOADED: SUCCESS
  LOADING --> ERROR: FAIL
  ERROR --> IDLE: REFETCH
  LOADED --> LOADED: ADD_TEMPLATE
  LOADED --> LOADED: DELETE_TEMPLATE
  LOADED --> LOADED: EDIT_TEMPLATE
```

| States  |
| ------- |
| IDLE    |
| LOADING |
| LOADED  |
| ERROR   |

| Actions         |
| --------------- |
| ADD_TEMPLATE    |
| DELETE_TEMPLATE |
| EDIT_TEMPLATE   |
| FETCH           |
| REFETCH         |
| SUCCESS         |
| FAIL            |

| Internal data | Notes                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| data          | The data returned by a successful call, containing templates           |
| template      | The template to be added, edited or deleted from the list of templates |

## Resume Editor State Machine

---

```mermaid
stateDiagram-v2
 direction LR
 [*] --> SELECT_TEMPLATE
 SELECT_TEMPLATE --> PERSONAL_INFO: NEXT
 PERSONAL_INFO --> EXPERIENCE: NEXT
 EXPERIENCE --> EDUCATION: NEXT
 EDUCATION --> SKILLS: NEXT
 PERSONAL_INFO --> SELECT_TEMPLATE: PREVIOUS
 EXPERIENCE --> PERSONAL_INFO: PREVIOUS
 EDUCATION --> EXPERIENCE: PREVIOUS
 SKILLS --> EDUCATION: PREVIOUS
 SELECT_TEMPLATE --> SELECT_TEMPLATE: SELECT_TEMPLATE
 PERSONAL_INFO --> PERSONAL_INFO: UPDATE_PERSONAL_INFO
 EXPERIENCE --> EXPERIENCE: ADD_EXPERIENCE
 EXPERIENCE --> EXPERIENCE: UPDATE_EXPERIENCE
 EXPERIENCE --> EXPERIENCE: REMOVE_EXPERIENCE
 EDUCATION --> EDUCATION: ADD_EDUCATION
 EDUCATION --> EDUCATION: UPDATE_EDUCATION
 EDUCATION --> EDUCATION: REMOVE_EDUCATION
 SKILLS --> SKILLS: ADD_SKILL
 SKILLS --> SKILLS: UPDATE_SKILL
 SKILLS --> SKILLS: REMOVE_SKILL
```

| States          |
| --------------- |
| SELECT_TEMPLATE |
| PERSONAL_INFO   |
| EXPERIENCE      |
| EDUCATION       |
| SKILLS          |

| Actions              |
| -------------------- |
| NEXT                 |
| PREVIOUS             |
| SELECT_TEMPLATE      |
| UPDATE_PERSONAL_INFO |
| ADD_EXPERIENCE       |
| UPDATE_EXPERIENCE    |
| REMOVE_EXPERIENCE    |
| ADD_EDUCATION        |
| UPDATE_EDUCATION     |
| REMOVE_EDUCATION     |
| ADD_SKILL            |
| UPDATE_SKILL         |
| REMOVE_SKILL         |

| Internal data      | Notes                                                      |
| ------------------ | ---------------------------------------------------------- |
| selectedTemplateId | The currently selected resume template id                  |
| personalInfo       | Personal information of the candidate                      |
| experiences        | List of work experiences                                   |
| education          | List of educational qualifications                         |
| skills             | List of skills with their respective scores                |
| state              | The current state of the resume editor (one of the States) |
