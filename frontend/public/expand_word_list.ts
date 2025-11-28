// frontend/public/expand_word_list.ts
// Ejecutar con:
//   Desde el directorio raíz del proyecto:
//     npx tsx frontend/public/expand_word_list.ts
//   
//   O desde frontend/public:
//     npx tsx expand_word_list.ts
//
// Nota: tsx es más moderno que ts-node para TypeScript ES modules

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

type WordEntry = { word: string };

// Obtener el directorio del script (compatible con ES modules y CommonJS)
const getScriptDir = () => {
  try {
    // Para ES modules
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
    // Para CommonJS
    return __dirname;
  } catch {
    // Fallback: buscar desde el directorio actual
    const cwd = process.cwd();
    if (cwd.endsWith('public')) {
      return cwd;
    }
    return path.join(cwd, 'frontend', 'public');
  }
};

const SCRIPT_DIR = getScriptDir();
const BASE_FILE = path.join(SCRIPT_DIR, "words_list.json"); // tu lista actual
const OUTPUT_FILE = path.join(SCRIPT_DIR, "word_list.json");

// Diccionario grande de 5 letras en ingles
const WORDS_URL = "https://darkermango.github.io/5-Letter-words/words.json";

async function main() {
  // 1) Leer tu lista base
  const baseRaw = fs.readFileSync(BASE_FILE, "utf8");
  const baseList: WordEntry[] = JSON.parse(baseRaw);

  const wordSet = new Set<string>();

  // Normalizar tu lista: uppercase + solo 5 letras
  for (const entry of baseList) {
    if (!entry?.word) continue;
    const w = String(entry.word).trim().toUpperCase();
    if (/^[A-Z]{5}$/.test(w)) {
      wordSet.add(w);
    }
  }

  console.log(`Base inicial: ${wordSet.size} palabras`);

  // 2) Descargar el diccionario externo
  console.log(`Descargando diccionario de 5 letras desde ${WORDS_URL} ...`);
  const res = await fetch(WORDS_URL);

  if (!res.ok) {
    throw new Error(`No se pudo descargar el diccionario: ${res.status} ${res.statusText}`);
  }

  const remoteData = await res.json();
  const remoteWords = Array.isArray(remoteData) ? remoteData : (remoteData.words || remoteData.data || []);

  console.log(`Palabras descargadas: ${remoteWords.length}`);

  // 3) Normalizar y mergear
  for (const raw of remoteWords) {
    const w = String(raw).trim().toUpperCase();
    if (/^[A-Z]{5}$/.test(w)) {
      wordSet.add(w);
    }
  }

  console.log(`Total despues del merge: ${wordSet.size} palabras`);

  // 4) Crear lista final ordenada en el formato { word: "XXXXX" }
  const mergedList: WordEntry[] = Array.from(wordSet)
    .sort((a, b) => a.localeCompare(b))
    .map((word) => ({ word }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mergedList, null, 2), "utf8");

  console.log(`✅ Generado ${OUTPUT_FILE} con ${mergedList.length} palabras de 5 letras.`);
}

main().catch((err) => {
  console.error("❌ Error ejecutando el script:", err);
  process.exit(1);
});
