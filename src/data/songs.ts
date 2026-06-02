import { Song } from "../schema/song";
import songsJson from "./songs.json";

export const SONGS: Song[] = songsJson as unknown as Song[];
