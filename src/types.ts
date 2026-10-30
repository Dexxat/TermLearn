export interface LessonAnatomy {
  token: string;
  label: "Comando Base" | "Comando" | "Flag" | "Argumento" | "Origen" | "Destino" | "Tubería (Pipe)" | "Redirección" | "Modificador" | "PID" | "Patrón" | "Ruta Especial" | string;
  desc: string;
  color: string;
}

export interface Lesson {
  id: string;
  title: string;
  desc: string;
  anatomy: LessonAnatomy[];
  objectiveText: string;
  suggestedCommand: string;
  validator: (command: string, fsState?: any) => boolean;
  hint: string;
  proTip: string;
  xp: number;
}

export interface CurriculumModule {
  id: string;
  title: string;
  badge: string;
  lessons: Lesson[];
}

export interface FSNode {
  type: "file" | "dir";
  content?: string;
  perms?: string;
  size?: number;
  children?: Record<string, FSNode>;
}

export interface ProcessItem {
  pid: number;
  user: string;
  cpu: string;
  mem: string;
  cmd: string;
}
