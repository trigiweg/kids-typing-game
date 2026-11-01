## Purpose

Defines how the game accepts Chinese input through zhuyin symbols mapped to the standard zhuyin keyboard layout, and how it helps children find keys, without relying on the system input method.

## ADDED Requirements

### Requirement: Zhuyin key mapping

The system SHALL map physical keys to zhuyin symbols using the standard zhuyin keyboard layout and SHALL read key presses directly from keyboard events, without using the operating system input method.

#### Scenario: Press the key for a symbol

- **GIVEN** a card asks for "ㄅ"
- **WHEN** the child presses the "1" key
- **THEN** the system SHALL accept "ㄅ" as typed

##### Example: layout samples

| Key | Symbol |
|-----|--------|
| 1 | ㄅ |
| q | ㄆ |
| a | ㄇ |
| z | ㄈ |
| 2 | ㄉ |
| u | ㄧ |
| j | ㄨ |
| m | ㄩ |
| 8 | ㄚ |

#### Scenario: Input method active

- **WHEN** the operating system input method is switched to Chinese while the game is running
- **THEN** key presses SHALL still be read by physical key, and the game SHALL NOT show any input method candidate window

### Requirement: Zhuyin keyboard guide

The system SHALL display an on-screen zhuyin keyboard in Chinese mode and an on-screen finger-position keyboard in English mode. The key for the next expected input SHALL be highlighted.

#### Scenario: Highlight next key

- **GIVEN** the current card expects "ㄇ" next
- **WHEN** the card becomes the active card
- **THEN** the "a" key on the on-screen keyboard is highlighted

#### Scenario: Show finger hint in English mode

- **GIVEN** English mode and the next expected letter is "f"
- **WHEN** the card becomes the active card
- **THEN** the on-screen keyboard highlights "f" and indicates the finger that types it

### Requirement: Tone handling

The system SHALL NOT require tone keys in the beginner tier. In the advanced tier the system SHALL require tone keys, where the first tone is typed with the space bar.

#### Scenario: Beginner tier has no tones

- **WHEN** a beginner-tier Chinese card is shown
- **THEN** its answer contains only zhuyin consonants, vowels, and medials

#### Scenario: First tone with space bar

- **GIVEN** an advanced-tier card whose answer ends with the first tone
- **WHEN** the child presses the space bar after the last symbol
- **THEN** the system SHALL accept the first tone and complete the card

### Requirement: Only valid keys are processed

The system SHALL ignore key presses outside the keys defined by the active mode, and SHALL prevent browser default actions for keys the game uses.

#### Scenario: Space bar does not scroll

- **WHEN** the child presses the space bar during a level
- **THEN** the page SHALL NOT scroll

### Requirement: Touch on-screen keyboard

The system SHALL let the child type by tapping the on-screen keyboard on touch devices. A tap on a key SHALL be processed exactly like the matching physical key press. Keys SHALL be at least 44 CSS pixels tall and SHALL shrink in width to fit the screen, but SHALL NOT be narrower than 28 CSS pixels.

#### Scenario: Tap a key on a tablet

- **GIVEN** a card asks for "ㄅ" and the device has no physical keyboard
- **WHEN** the child taps the on-screen key labelled "ㄅ"
- **THEN** the system SHALL accept "ㄅ" as typed

#### Scenario: Tap does not zoom or select text

- **WHEN** the child taps keys quickly several times
- **THEN** the page SHALL NOT zoom, scroll, or select text