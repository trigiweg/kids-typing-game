## Purpose

Defines the core gameplay of the kids typing game: falling word cards, level progression, and grade-based difficulty tiers for elementary students in grades 1 to 6.

## ADDED Requirements

### Requirement: Grade tier selection

The system SHALL offer three grade tiers on the start screen: beginner (grades 1-2), intermediate (grades 3-4), and advanced (grades 5-6). Each tier SHALL use its own question bank and difficulty settings.

#### Scenario: Choose a tier

- **WHEN** the child selects a grade tier on the start screen
- **THEN** the system SHALL load the level map for that tier and use only that tier's question bank

##### Example: tier content

| Tier | English content | Chinese content |
|------|-----------------|-----------------|
| beginner | single letters, 3-4 letter words (cat, dog) | single zhuyin symbols (ㄅ) |
| intermediate | common textbook words and short phrases | single characters with zhuyin spelling (ㄇㄚ) |
| advanced | longer words and short sentences | words and idioms with zhuyin spelling including tone keys |

### Requirement: Falling card gameplay

The system SHALL drop question cards from the top of the play area toward the bottom. When the child types the complete answer of a card correctly, the system SHALL remove that card with a visual and sound effect.

#### Scenario: Correct answer clears a card

- **GIVEN** a card showing "cat" is falling
- **WHEN** the child types c, a, t in order
- **THEN** the card is removed and the score increases

#### Scenario: Wrong key does not remove the card

- **GIVEN** a card showing "cat" is falling and the child has typed "c"
- **WHEN** the child types "x"
- **THEN** the card stays, the typed progress on that card remains "c", and the wrong-key feedback is shown

#### Scenario: Card reaches the bottom

- **WHEN** a card reaches the bottom of the play area before it is cleared
- **THEN** the card is removed and counted as missed

### Requirement: Language modes

The system SHALL provide an English mode and a Chinese zhuyin mode in every grade tier. The child SHALL choose the mode before starting a level.

#### Scenario: Pick a language mode

- **WHEN** the child chooses Chinese mode in the beginner tier
- **THEN** every card in that level asks for a zhuyin symbol

### Requirement: Level map progression

The system SHALL present each tier as a level map. A level SHALL be locked until the previous level in the same tier and mode is cleared with at least one star.

#### Scenario: Unlock next level

- **GIVEN** level 1 is cleared with one or more stars
- **WHEN** the child returns to the level map
- **THEN** level 2 is selectable

#### Scenario: Locked level

- **WHEN** the child selects a level whose previous level has no stars
- **THEN** the system SHALL NOT start the level and SHALL show that it is locked

### Requirement: Question bank size

The system SHALL ship at least 50 questions for each combination of tier and language mode.

#### Scenario: Bank is complete

- **WHEN** the question bank data is validated
- **THEN** each of the six combinations (3 tiers x 2 modes) contains at least 50 distinct questions

### Requirement: Responsive layout

The system SHALL lay out every screen (home, level play, result) so it is usable without horizontal scrolling on phone width (360 CSS pixels and wider), tablet width (768 CSS pixels and wider), and computer width (1280 CSS pixels and wider).

#### Scenario: Phone width

- **WHEN** the viewport is 390 CSS pixels wide
- **THEN** the grade tier cards stack in one column, the play area and the on-screen keyboard both fit within the viewport, and no horizontal scrollbar appears

#### Scenario: Computer width

- **WHEN** the viewport is 1280 CSS pixels wide
- **THEN** the grade tier cards appear in one row of three, and the home screen shows the daily challenge beside them

##### Example: layout by width

| Viewport width | Tier cards | Keyboard key size |
|----------------|------------|-------------------|
| 390 | 1 column | 44 px tall, about 31 px wide, fills the width |
| 768 | 3 columns | 48 px tall, about 62 px wide |
| 1280 | 3 columns | 64 px wide, 56 px tall |