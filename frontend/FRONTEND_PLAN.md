# Reminder App - Technical Implementation Plan

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Tailwind v4 for styling
- shadcn/ui components
- React Hook Form + Zod for form validation
- Local Storage for data persistence
- Date-fns for date/time handling

## Page Structure & Implementation Plan

### 1. Main App Layout (`src/App.tsx`)

**Components:**

- App container with routing setup
- Global notification provider (Sonner)

**Features:**

- Route configuration for reminder pages
- Global state management setup

### 2. Reminder List Page (`src/pages/RemindersPage.tsx`)

**Components:**

- `ReminderList` - Display all reminders
- `ReminderCard` - Individual reminder item
- `EmptyState` - When no reminders exist
- Navigation to create reminder

**Utils:**

- `src/utils/reminderUtils.ts` - Sorting, filtering logic
- `src/utils/dateUtils.ts` - Date formatting helpers

**API/Services:**

- `src/services/reminderService.ts` - CRUD operations for reminders
- Local storage integration

**Types:**

- `src/types/reminder.ts` - Reminder interface definition

### 3. Create Reminder Page (`src/pages/CreateReminderPage.tsx`)

**Components:**

- `CreateReminderForm` - Main form component
- Form fields: Textarea for reminder text, DateTime picker
- `CreateReminder` button
- Navigation back to list

**Form Components:**

- Uses existing shadcn components: `Input`, `Textarea`, `Button`, `Label`
- Custom `DateTimePicker` component using `Calendar` + time input

**Validation:**

- Zod schema for form validation
- Required field validation
- Future date validation

**Features:**

- Form submission handling
- Success/error notifications
- Redirect after creation

### 4. Common Components

#### `src/components/reminder/ReminderCard.tsx`

- Display reminder text
- Show formatted date/time
- Status indicators (upcoming, overdue)
- Delete/edit actions

#### `src/components/reminder/DateTimePicker.tsx`

- Combined date and time selection
- Uses shadcn `Calendar` component
- Time input with AM/PM format
- Validation for past dates

#### `src/components/layout/AppLayout.tsx`

- Main app container
- Header with app title
- Navigation structure

### 5. Services & Utils

#### `src/services/reminderService.ts`

- `createReminder(reminder: CreateReminderData)`
- `getReminders(): Reminder[]`
- `deleteReminder(id: string)`
- `updateReminder(id: string, data: Partial<Reminder>)`

#### `src/utils/reminderUtils.ts`

- `sortRemindersByDate(reminders: Reminder[])`
- `filterUpcomingReminders(reminders: Reminder[])`
- `isOverdue(reminder: Reminder): boolean`

#### `src/utils/dateUtils.ts`

- `formatReminderDate(date: Date): string`
- `isValidFutureDate(date: Date): boolean`
- `parseDateTime(dateStr: string, timeStr: string): Date`

### 6. Types & Interfaces

#### `src/types/reminder.ts`

```typescript
interface Reminder {
    id: string;
    text: string;
    dateTime: Date;
    createdAt: Date;
    status: 'upcoming' | 'overdue' | 'completed';
}

interface CreateReminderData {
    text: string;
    dateTime: Date;
}
```

### 7. Hooks

#### `src/hooks/useReminders.ts`

- Custom hook for reminder CRUD operations
- State management for reminders list
- Loading and error states

#### `src/hooks/useReminderNotifications.ts`

- Browser notification integration
- Check for due reminders
- Notification permission handling

## Implementation Phases

### Phase 1: Core Structure

1. Set up routing and basic layout
2. Create reminder types and interfaces
3. Implement basic reminder service with localStorage

### Phase 2: Create Reminder Feature

1. Build CreateReminderForm component
2. Implement DateTimePicker component
3. Add form validation with Zod
4. Connect form submission to service

### Phase 3: Display Reminders

1. Create RemindersPage and ReminderList
2. Build ReminderCard component
3. Add sorting and filtering utils
4. Implement empty states

### Phase 4: Polish & Features

1. Add notifications for due reminders
2. Implement delete/edit functionality
3. Add status indicators and overdue logic
4. Style components with Tailwind v4

## Key Files to Create/Modify

**New Files:**

- `src/pages/RemindersPage.tsx`
- `src/pages/CreateReminderPage.tsx`
- `src/components/reminder/CreateReminderForm.tsx`
- `src/components/reminder/ReminderCard.tsx`
- `src/components/reminder/ReminderList.tsx`
- `src/components/reminder/DateTimePicker.tsx`
- `src/services/reminderService.ts`
- `src/types/reminder.ts`
- `src/utils/reminderUtils.ts`
- `src/utils/dateUtils.ts`
- `src/hooks/useReminders.ts`

**Modified Files:**

- `src/App.tsx` - Add routing
- `src/main.tsx` - Add any global providers

## Technical Considerations

- **Data Persistence**: localStorage for simplicity, easily upgradeable to API
- **Form Validation**: Comprehensive validation for user experience
- **Date Handling**: Robust date/time parsing and formatting
- **Responsive Design**: Mobile-first approach with Tailwind
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Efficient rendering with React 19 features
