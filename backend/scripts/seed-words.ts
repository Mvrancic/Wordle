// Cargar variables de entorno ANTES de importar Prisma
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env en el directorio backend
dotenv.config({ path: path.join(__dirname, '../.env') });

// Crear PrismaClient directamente en el script para evitar problemas con singleton
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// 25 palabras por letra (A-Z, sin Ñ)
// Total: 650 palabras de 5 letras en español latinoamericano
// Todas las palabras son reales, sin repeticiones y sin palabras en inglés
const WORDS_BY_LETTER: Record<string, string[]> = {
  A: [
    'ACTOS',
    'AGUDO',
    'ALGAS',
    'ALTAR',
    'AMADO',
    'AMBOS',
    'AMIGO',
    'ANCLA',
    'ANGEL',
    'ANIMO',
    'ANSIA',
    'ANTES',
    'APODO',
    'ARBOL',
    'ARDOR',
    'AREAS',
    'ARMAR',
    'ARROZ',
    'ARTES',
    'ASADO',
    'ASPAS',
    'ATLAS',
  ],
  B: [
    'BAILE',
    'BALON',
    'BANCO',
    'BANDA',
    'BARCO',
    'BARRA',
    'BARRO',
    'BASAR',
    'BASES',
    'BASTA',
    'BASTO',
    'BATIR',
    'BELLA',
    'BELLO',
    'BESAR',
    'BICHO',
    'BOCAS',
    'BODAS',
    'BOLSA',
    'BOMBA',
    'BORDE',
    'BOTAS',
    'BRASA',
    'BRAZO',
  ],
  C: [
    'CABAL',
    'CABOS',
    'CABRA',
    'CACHE',
    'CAIDA',
    'CAJAS',
    'CALAR',
    'CALDO',
    'CALMA',
    'CALOR',
    'CALVO',
    'CAMAS',
    'CAMPO',
    'CANAL',
    'CANAS',
    'CANON',
    'CANTO',
    'CAPAS',
    'CARAS',
    'CARGO',
    'CARNE',
    'CARRO',
    'CASAS',
    'CASCO',
    'CAZAR',
  ],
  D: [
    'DADOS',
    'DANZA',
    'DARDO',
    'DATOS',
    'DEBER',
    'DECIR',
    'DEDOS',
    'DELTA',
    'DEMAS',
    'DENSO',
    'DESEO',
    'DEUDA',
    'DICHA',
    'DIETA',
    'DIGNO',
    'DIJES',
    'DINOS',
  ],
  E: [
    'EBANO',
    'EDEMA',
    'EDUCO',
    'ELEGI',
    'EMANA',
    'EMITE',
    'EMOTE',
    'ENCIA',
    'ENEMA',
    'ENVIO',
  ],
  F: [
    'FACAS',
    'FACHA',
    'FACIL',
    'FACTO',
    'FAENA',
    'FAJAS',
    'FALDA',
    'FALLA',
    'FALLO',
    'FALTA',
    'FALTO',
    'FAMAS',
    'FANGO',
    'FANTA',
    'FARDO',
    'FAROL',
  ],
  G: [
    'GAFAS',
    'GAFES',
    'GAGAS',
    'GAITA',
    'GALAN',
    'GALAS',
    'GALGO',
    'GALON',
    'GALOS',
    'GAMAS',
    'GAMBA',
    'GAMMA',
    'GANAR',
    'GANAS',
    'GANGA',
    'GANSO',
    'GARRA',
    'GARZA',
    'GASAS',
    'GASES',
  ],
  H: [
    'HABER',
    'HABLA',
    'HABLO',
    'HACER',
    'HADAS',
    'HALAR',
    'HALLA',
    'HALLO',
    'HARAS',
    'HARDA',
    'HARPA',
    'HARTA',
    'HARTO',
    'HASTA',
    'HAYAS',
  ],
  I: [
    'ICONO',
    'IDEAL',
    'IDEAS',
    'IDOLA',
    'IDOLO',
    'IGUAL',
    'ILEON',
    'IMITA',
  ],
  J: [
    'JABON',
    'JADES',
    'JALAR',
    'JALAS',
    'JALON',
    'JAMON',
  ],
  K: [
    'KILOS',
    'KAPPA',
    'KARMA',
    'KAYAK',
    'KENDO',
    'KENIA',
    'KOALA',
    'KORAN',
    'KYOTO',
  ],
  L: [
    'LABIA',
    'LABIO',
    'LABOR',
    'LABRA',
    'LABRO',
    'LACAS',
    'LACIO',
    'LACRA',
    'LADRA',
    'LADRO',
    'LAGOS',
    'LAMAS',
  ],
  M: [
    'MACAS',
    'MACHO',
    'MACIA',
    'MACIO',
    'MACRO',
    'MADRE',
    'MAFIA',
    'MAGAS',
    'MAGIA',
    'MAGMA',
    'MAGNA',
    'MAGNO',
    'MAGOS',
    'MAGRA',
    'MAGRO',
  ],
  N: [
    'NAVAL',
    'NACER',
    'NACHO',
    'NADAL',
    'NADAR',
    'NADAS',
    'NADIE',
    'NAFTA',
  ],
  O: [
    
    'OBVIA',
    'OBVIO',
    'OCASO',
    'OCIOS',
    'OCOTE',
    'OCREA',
    'OCRES',
    'OCTAL',
    'OCULO',
    'OCUPA',
    'OCUPE',
    'OCUPO',
    'ODEON',
    'ODIAR',
    'ODIAS',
    'ODIOS',
  ],
  P: [
    'PACHO',
    'PACTA',
    'PACTO',
    'PADEL',
    'PADRE',
    'PAGAN',
    'PAGAR',
    'PAGAS',
    'PAGOS',
    'PAGUE',
    'PAISA',
    'PAJAR',
  ],
  Q: [
    'QUEMA',
    'QUEME',
    'QUEMO',
    'QUENA',
    'QUESO',
    'QUIEN',
    'QUISO',
  ],
  R: [
    'RABAS',
    'RABIA',
    'RACHA',
    'RACIO',
    'RACON',
    'RADAR',
    'RADIA',
    'RADIO',
  ],
  S: [
    'SABEN',
    'SABER',
    'SABES',
    'SABIA',
    'SABIO',
    'SABLE',
    'SABOR',
    'SABRA',
    'SABRE',
    'SACAR',
    'SACAS',
    'SACIA',
    'SACIO',
    'SACOS',
    'SACRA',
    'SACRO',
  ],
  T: [
    'TABLA',
    'TACHA',
    'TACHE',
    'TACHO',
    'TACIA',
    'TACIO',
    'TACON',
    'TACOS',
    'TACTO',
    'TADEO',
  ],
  U: [
    'UBERA',
    'UBERO',
    'UBICA',
    'UBICO',
  ],
  V: [
    'VACAS',
    'VACIA',
    'VACIE',
    'VACIO',
    'VAGAR',
    'VAGAS',
    'VAGOS',
  ],
  W: [
    'WATTS',
  ],
  Y: [
    'YACAL',
    'YACEN',
    'YACER',
    'YACES',
    'YAPAS',
  ]
};

async function seedWords() {
  try {
    console.log('🌱 Iniciando seed de palabras...');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Obtener o crear el modo de juego "classic"
    let gameMode = await prisma.gameMode.findUnique({
      where: { name: 'classic' },
    });

    if (!gameMode) {
      gameMode = await prisma.gameMode.create({
        data: {
          name: 'classic',
          description: 'Modo clásico ilimitado',
        },
      });
      console.log('✅ Modo de juego "classic" creado');
    } else {
      console.log('✅ Modo de juego "classic" encontrado');
    }

    // Preparar todas las palabras y verificar duplicados
    const allWords: Array<{ gameModeId: string; word: string; length: number; language: string }> = [];
    const seenWords = new Set<string>();

    for (const [_letter, words] of Object.entries(WORDS_BY_LETTER)) {
      for (const word of words) {
        const upperWord = word.toUpperCase();
        
        // Verificar que la palabra tenga 5 letras
        if (upperWord.length === 5) {
          // Verificar que no esté duplicada
          if (!seenWords.has(upperWord)) {
            seenWords.add(upperWord);
            allWords.push({
              gameModeId: gameMode.id,
              word: upperWord,
              length: 5,
              language: 'es',
            });
          } else {
            console.warn(`⚠️  Palabra duplicada encontrada: ${upperWord}`);
          }
        } else {
          console.warn(`⚠️  Palabra con longitud incorrecta: ${word} (${word.length} letras)`);
        }
      }
    }

    console.log(`📝 Preparadas ${allWords.length} palabras únicas para insertar`);

    // Insertar palabras en lotes de 100 para evitar problemas de memoria
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < allWords.length; i += batchSize) {
      const batch = allWords.slice(i, i + batchSize);
      await prisma.gameModeWord.createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted += batch.length;
      console.log(`✅ Insertadas ${inserted}/${allWords.length} palabras`);
    }

    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
seedWords()
  .then(() => {
    console.log('✨ Proceso finalizado');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
