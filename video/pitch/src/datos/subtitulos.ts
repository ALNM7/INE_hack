import s1 from "../subtitulos/1.json";
import s2 from "../subtitulos/2.json";
import s3 from "../subtitulos/3.json";
import s4 from "../subtitulos/4.json";
import s5 from "../subtitulos/5.json";
import s6 from "../subtitulos/6.json";
import s7 from "../subtitulos/7.json";
import s8 from "../subtitulos/8.json";
import s9 from "../subtitulos/9.json";

export type Subtitulos = typeof s1;
const todos: Record<number, Subtitulos> = { 1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6, 7: s7, 8: s8, 9: s9 };
export const subtitulosDe = (clip: number) => todos[clip];
