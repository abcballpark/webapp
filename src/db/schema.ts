import { boolean, numeric, pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export const Registrant = pgTable("REGISTRANT", {
  id: serial("ID").primaryKey(),
  guardianId: text("GUARDIAN_ID").notNull(),
  firstName: text("FIRST_NAME").notNull(),
  lastName: text("LAST_NAME").notNull(),
  birthDate: timestamp("BIRTH_DATE").notNull(),
  sex: text("SEX").notNull(),
  nickName: text("NICK_NAME"),
});

export const RegistrantRelations = relations(Registrant, ({ many }) => ({
  enrollments: many(Enrollee),
  playerAssignments: many(Player),
  coachingAssignments: many(Coach),
}));

export const Enrollee = pgTable("ENROLLEE", {
  id: serial("ID").primaryKey(),
  registrantId: text("REGISTRANT_ID").notNull(),
  programId: text("PROGRAM_ID").notNull(),
  enrollmentDate: timestamp("ENROLLMENT_DATE").notNull(),
  preference: text("PREFERENCE"),
});

export const EnrolleeRelations = relations(Enrollee, ({ one }) => ({
  registrant: one(Registrant, {
    fields: [Enrollee.registrantId],
    references: [Registrant.id],
  }),
}));

export const Player = pgTable("PLAYER", {
  id: serial("ID").primaryKey(),
  registrantId: text("REGISTRANT_ID").notNull(),
  divisionId: text("DIVISION_ID").notNull(),
  teamId: text("TEAM_ID").notNull(),
  jerseyNumber: text("JERSEY_NUMBER"),
});

export const PlayerRelations = relations(Player, ({ one }) => ({
  registrant: one(Registrant, {
    fields: [Player.registrantId],
    references: [Registrant.id],
  }),
  team: one(Team, {
    fields: [Player.teamId],
    references: [Team.id],
  }),
  division: one(Division, {
    fields: [Player.divisionId],
    references: [Division.id],
  }),
}));

export const Coach = pgTable("COACH", {
  registrantId: text("REGISTRANT_ID").notNull(),
  teamId: text("TEAM_ID").notNull(),
  position: text("POSITION"),
});

export const CoachRelations = relations(Coach, ({ one }) => ({
  registrant: one(Registrant, {
    fields: [Coach.registrantId],
    references: [Registrant.id],
  }),
  team: one(Team, {
    fields: [Coach.teamId],
    references: [Team.id],
  }),
}));

export const Team = pgTable("TEAM", {
  id: serial("ID").primaryKey(),
  name: text("NAME").notNull(),
  managerId: text("MANAGER_ID").notNull(),
  divisionId: text("DIVISION_ID").notNull(),
});

export const TeamRelations = relations(Team, ({ one, many }) => ({
  players: many(Player),
  coaches: many(Coach),
  // TODO: Check that this relationship works
  awayGames: many(Game),
  homeGames: many(Game),
  division: one(Division, {
    fields: [Team.divisionId],
    references: [Division.id],
  }),
  manager: one(Registrant, {
    fields: [Team.managerId],
    references: [Registrant.id],
  }),
}));

export const Program = pgTable("PROGRAM", {
  id: serial("ID").primaryKey(),
  name: text("NAME").notNull(),
  description: text("DESCRIPTION"),
});

export const ProgramRelations = relations(Program, ({ many }) => ({
  divisions: many(Division),
  events: many(Event),
}));

export const Division = pgTable("DIVISION", {
  id: serial("ID").primaryKey(),
  name: text("NAME").notNull(),
  description: text("DESCRIPTION"),
  programId: text("PROGRAM_ID").notNull(),
  ageMin: text("AGE_MIN").notNull(),
  ageMax: text("AGE_MAX").notNull(),
});

export const DivisionRelations = relations(Division, ({ one, many }) => ({
  program: one(Program, {
    fields: [Division.programId],
    references: [Program.id],
  }),
  teams: many(Team),
  players: many(Player),
}));

export const Event = pgTable("EVENT", {
  id: serial("ID").primaryKey(),
  name: text("NAME").notNull(),
  type: text("TYPE"),
  description: text("DESCRIPTION"),
  startDate: timestamp("START_DATE").notNull(),
  endDate: timestamp("END_DATE").notNull(),
  locationId: text("LOCATION_ID").notNull(),
});

export const EventRelations = relations(Event, ({ one }) => ({
  location: one(Location, {
    fields: [Event.locationId],
    references: [Location.id],
  }),
}));

export const Game = pgTable("GAME", {
  id: serial("ID").primaryKey(),
  eventId: text("EVENT_ID").notNull(),
  homeTeamId: text("HOME_TEAM_ID").notNull(),
  awayTeamId: text("AWAY_TEAM_ID").notNull(),
  homeTeamScore: numeric("HOME_TEAM_SCORE"),
  awayTeamScore: numeric("AWAY_TEAM_SCORE"),
});

export const GameRelations = relations(Game, ({ one }) => ({
  event: one(Event, {
    fields: [Game.eventId],
    references: [Event.id],
  }),
  homeTeam: one(Team, {
    fields: [Game.homeTeamId],
    references: [Team.id],
  }),
  awayTeam: one(Team, {
    fields: [Game.awayTeamId],
    references: [Team.id],
  }),
}));

export const Location = pgTable("LOCATION", {
  id: serial("ID").primaryKey(),
  name: text("NAME").notNull(),
  playable: boolean("PLAYABLE").default(true).notNull(),
  latitude: numeric("LATITUDE").notNull(),
  longitude: numeric("LONGITUDE").notNull(),
});
