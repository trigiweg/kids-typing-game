# progress-storage Specification

## Purpose

Defines how the game stores and shows each child's own progress on the local device, working offline with no accounts and no network use.

## Requirements

### Requirement: Local progress persistence

The system SHALL save progress (stars per level, stickers, unlocked themes, best combo, daily challenge date) in the browser's localStorage and SHALL restore it on the next visit.

#### Scenario: Progress survives reload

- **GIVEN** the child has cleared level 1 with 2 stars
- **WHEN** the page is reloaded
- **THEN** level 1 still shows 2 stars and level 2 is unlocked

---
### Requirement: Progress display

The system SHALL display only the child's own results on the child's screen: sticker count and best combo. The system SHALL NOT show other players' data.

#### Scenario: Show personal results

- **WHEN** the child opens the home screen
- **THEN** the screen shows the sticker count and best combo from local progress

---
### Requirement: Offline and no network use

The system SHALL work when opened as a local file or served statically, and SHALL NOT send any network request for progress, analytics, or accounts.

#### Scenario: Offline play

- **GIVEN** the device has no network connection
- **WHEN** the child opens the game and plays a level
- **THEN** all features work and no network request is made

---
### Requirement: Storage unavailable fallback

If localStorage is unavailable or throws an error, the system SHALL continue to run with in-memory progress and SHALL show a notice that progress will not be saved.

#### Scenario: Storage blocked

- **GIVEN** the browser blocks localStorage
- **WHEN** the child plays a level
- **THEN** the game works normally and a notice states that progress will not be saved

---
### Requirement: Reset progress

The system SHALL provide a reset action that requires an explicit confirmation before erasing saved progress.

#### Scenario: Confirm reset

- **WHEN** the child selects reset and confirms
- **THEN** all saved progress is erased and the game returns to its initial state

#### Scenario: Cancel reset

- **WHEN** the child selects reset and cancels
- **THEN** saved progress remains unchanged
