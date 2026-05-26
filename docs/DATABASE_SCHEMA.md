# Database Schema

## User

- `name`
- `phone`
- `email`
- `passwordHash`
- `role`: `admin` or `member`
- `address`
- `membershipId`
- `avatarUrl`
- `isActive`
- `joinedAt`

## Book

- `title`
- `author`
- `category`
- `isbn`
- `coverUrl`
- `description`
- `totalCopies`
- `availableCopies`
- `shelf`
- `tags`

## Reservation

- `book`
- `member`
- `status`: `reserved`, `borrowed`, `returned`, `cancelled`
- `reservedAt`
- `borrowedAt`
- `dueAt`
- `returnedAt`

## Event

- `title`
- `type`: `community`, `sports`, `library`, `charity`, `medical`
- `description`
- `location`
- `startsAt`
- `endsAt`
- `capacity`
- `imageUrl`
- `status`
- `registrations`
- `gallery`

## SportsUpdate

- `title`
- `sport`
- `summary`
- `scheduleAt`
- `venue`
- `score`
- `media`
- `isHighlight`

## MedicalEquipment

- `name`
- `type`: `medical-bed`, `wheelchair`, `nebulizer`, `oxygen-concentrator`, `other`
- `description`
- `totalUnits`
- `availableUnits`
- `condition`
- `imageUrl`
- `isEmergencyReady`

## EquipmentRequest

- `equipment`
- `member`
- `patientName`
- `phone`
- `address`
- `reason`
- `urgency`: `normal`, `urgent`, `emergency`
- `status`: `pending`, `approved`, `issued`, `returned`, `rejected`
- `requestedFrom`
- `requestedTo`

## Notification

- `title`
- `message`
- `type`: `event`, `book`, `announcement`, `charity`, `emergency`
- `audience`: `all`, `members`, `admins`, `single`
- `recipient`
- `readBy`
- `link`
