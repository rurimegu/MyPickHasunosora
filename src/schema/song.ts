export enum Unit {
  None,
  CeriseBouquet,
  Dollchestra,
  MiraCraPark,
  EdelNote,
  Hasunosora,
  Other,
}

export enum GradeClass {
  C103,
  C104,
  C105,
}

export interface MString {
  ja: string;
  romaji: string;
}

export interface Song {
  title: MString;
  artist: MString;
  lyricist: MString;
  composer: MString;
  arranger: MString;
  coverUrl: string;
  unit: Unit;
  class: GradeClass;
}

export interface RowConfig {
  id: Unit;
  name: string;
  nameJa: string;
  colorClass: string;
  textColor: string;
  glowColor: string;
  accentColor: string;
  bgStyle?: string;
  borderStyle?: string;
}

export interface ColConfig {
  id: GradeClass;
  name: string;
  label: string;
}

