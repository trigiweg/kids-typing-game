## Purpose

Defines the reward and penalty rules that motivate children while keeping failure gentle: combos, star ratings, stickers, theme unlocks, a daily challenge, and hearts.

## ADDED Requirements

### Requirement: Combo multiplier

The system SHALL track consecutive correct cards as a combo and SHALL apply a score multiplier: x1 below 5 combo, x2 from 5 to 9, and x3 from 10 upward.

#### Scenario: Combo grows

- **GIVEN** the child has cleared 4 cards in a row
- **WHEN** the child clears the 5th card
- **THEN** the combo is 5 and the score for that card uses the x2 multiplier

#### Scenario: Wrong key resets combo

- **GIVEN** the combo is 7
- **WHEN** the child presses a wrong key
- **THEN** the combo resets to 0

### Requirement: Star rating

The system SHALL award 1 to 3 stars at the end of a cleared level based on accuracy (correct key presses divided by total key presses): 1 star below 80 percent, 2 stars from 80 to 94 percent, 3 stars from 95 percent upward.

#### Scenario: Three stars

- **GIVEN** the child made 100 key presses with 96 correct
- **WHEN** the level ends in a clear
- **THEN** the system awards 3 stars

##### Example: accuracy boundaries

| Accuracy | Stars |
|----------|-------|
| 79% | 1 |
| 80% | 2 |
| 94% | 2 |
| 95% | 3 |

### Requirement: Hearts by tier

The system SHALL give the beginner tier no hearts, the intermediate tier 5 hearts per level, and the advanced tier 3 hearts per level. A card reaching the bottom SHALL cost 1 heart in tiers that have hearts.

#### Scenario: Beginner has no hearts

- **WHEN** a card reaches the bottom in a beginner-tier level
- **THEN** no heart is deducted and the level continues

#### Scenario: Heart lost

- **GIVEN** an intermediate-tier level with 5 hearts
- **WHEN** a card reaches the bottom
- **THEN** hearts become 4 and the combo resets to 0

### Requirement: Level failure is gentle

When all hearts are used, the system SHALL end the level as failed and offer a retry of the same level. The system SHALL NOT reduce the total score, SHALL NOT remove collected stickers, and SHALL NOT show mocking text.

#### Scenario: Out of hearts

- **GIVEN** the child owns 8 stickers and 0 hearts remain
- **WHEN** the level fails
- **THEN** the child still owns 8 stickers and sees an encouraging message with a retry button

### Requirement: Sticker collection and theme unlock

The system SHALL award one sticker for each cleared level. Collecting a full set of stickers SHALL unlock the next visual theme (space, ocean, animals).

#### Scenario: Sticker for clear

- **WHEN** the child clears a level
- **THEN** one new sticker is added to the collection

#### Scenario: Theme unlock

- **GIVEN** the child needs one more sticker to complete the current set
- **WHEN** the child clears a level
- **THEN** the set is complete and the next theme becomes selectable

### Requirement: Daily challenge

The system SHALL offer one daily challenge per local calendar day. Completing it SHALL award one bonus sticker once per day.

#### Scenario: Complete daily challenge

- **GIVEN** the daily challenge has not been completed today
- **WHEN** the child completes it
- **THEN** one bonus sticker is awarded and the challenge shows as done until the next local day

#### Scenario: No second bonus on the same day

- **GIVEN** the daily challenge was completed today
- **WHEN** the child completes it again
- **THEN** no additional bonus sticker is awarded
