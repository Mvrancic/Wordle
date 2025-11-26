-- Script SQL para insertar palabras en game_mode_words
-- Ejecutar en el SQL Editor de Supabase
-- Este script inserta todas las palabras de 5 letras en español latinoamericano

-- Primero, asegurarse de que el modo de juego "classic" existe
INSERT INTO game_modes (name, description)
VALUES ('classic', 'Modo clásico ilimitado')
ON CONFLICT (name) DO NOTHING;

-- Obtener el ID del modo de juego "classic"
-- Luego insertar todas las palabras

-- Insertar palabras con el game_mode_id del modo "classic"
INSERT INTO game_mode_words (game_mode_id, word, length, language)
SELECT 
    (SELECT id FROM game_modes WHERE name = 'classic'),
    word,
    5,
    'es'
FROM (VALUES
    ('ACTOS'), ('AGUDO'), ('ALGAS'), ('ALTAR'), ('AMADO'), ('AMBOS'), ('AMIGO'), ('ANCLA'), ('ANGEL'), ('ANIMO'), ('ANSIA'), ('ANTES'), ('APODO'), ('ARBOL'), ('ARDOR'), ('AREAS'), ('ARMAR'), ('ARROZ'), ('ARTES'), ('ASADO'), ('ASPAS'), ('ATLAS'),
    ('BAILE'), ('BALON'), ('BANCO'), ('BANDA'), ('BARCO'), ('BARRA'), ('BARRO'), ('BASAR'), ('BASES'), ('BASTA'), ('BASTO'), ('BATIR'), ('BELLA'), ('BELLO'), ('BESAR'), ('BICHO'), ('BOCAS'), ('BODAS'), ('BOLSA'), ('BOMBA'), ('BORDE'), ('BOTAS'), ('BRASA'), ('BRAZO'),
    ('CABAL'), ('CABOS'), ('CABRA'), ('CACHE'), ('CAIDA'), ('CAJAS'), ('CALAR'), ('CALDO'), ('CALMA'), ('CALOR'), ('CALVO'), ('CAMAS'), ('CAMPO'), ('CANAL'), ('CANAS'), ('CANON'), ('CANTO'), ('CAPAS'), ('CARAS'), ('CARGO'), ('CARNE'), ('CARRO'), ('CASAS'), ('CASCO'), ('CAZAR'),
    ('DADOS'), ('DANZA'), ('DARDO'), ('DATOS'), ('DEBER'), ('DECIR'), ('DEDOS'), ('DELTA'), ('DEMAS'), ('DENSO'), ('DESEO'), ('DEUDA'), ('DICHA'), ('DIETA'), ('DIGNO'), ('DIJES'), ('DINOS'),
    ('EBANO'), ('EDEMA'), ('EDUCO'), ('ELEGI'), ('EMANA'), ('EMITE'), ('EMOTE'), ('ENCIA'), ('ENEMA'), ('ENVIO'),
    ('FACAS'), ('FACHA'), ('FACIL'), ('FACTO'), ('FAENA'), ('FAJAS'), ('FALDA'), ('FALLA'), ('FALLO'), ('FALTA'), ('FALTO'), ('FAMAS'), ('FANGO'), ('FANTA'), ('FARDO'), ('FAROL'),
    ('GAFAS'), ('GAFES'), ('GAGAS'), ('GAITA'), ('GALAN'), ('GALAS'), ('GALGO'), ('GALON'), ('GALOS'), ('GAMAS'), ('GAMBA'), ('GAMMA'), ('GANAR'), ('GANAS'), ('GANGA'), ('GANSO'), ('GARRA'), ('GARZA'), ('GASAS'), ('GASES'),
    ('HABER'), ('HABLA'), ('HABLO'), ('HACER'), ('HADAS'), ('HALAR'), ('HALLA'), ('HALLO'), ('HARAS'), ('HARDA'), ('HARPA'), ('HARTA'), ('HARTO'), ('HASTA'), ('HAYAS'),
    ('ICONO'), ('IDEAL'), ('IDEAS'), ('IDOLA'), ('IDOLO'), ('IGUAL'), ('ILEON'), ('IMITA'),
    ('JABON'), ('JADES'), ('JALAR'), ('JALAS'), ('JALON'), ('JAMON'),
    ('KILOS'), ('KAPPA'), ('KARMA'), ('KAYAK'), ('KENDO'), ('KENIA'), ('KOALA'), ('KORAN'), ('KYOTO'),
    ('LABIA'), ('LABIO'), ('LABOR'), ('LABRA'), ('LABRO'), ('LACAS'), ('LACIO'), ('LACRA'), ('LADRA'), ('LADRO'), ('LAGOS'), ('LAMAS'),
    ('MACAS'), ('MACHO'), ('MACIA'), ('MACIO'), ('MACRO'), ('MADRE'), ('MAFIA'), ('MAGAS'), ('MAGIA'), ('MAGMA'), ('MAGNA'), ('MAGNO'), ('MAGOS'), ('MAGRA'), ('MAGRO'),
    ('NAVAL'), ('NACER'), ('NACHO'), ('NADAL'), ('NADAR'), ('NADAS'), ('NADIE'), ('NAFTA'),
    ('OBVIA'), ('OBVIO'), ('OCASO'), ('OCIOS'), ('OCOTE'), ('OCREA'), ('OCRES'), ('OCTAL'), ('OCULO'), ('OCUPA'), ('OCUPE'), ('OCUPO'), ('ODEON'), ('ODIAR'), ('ODIAS'), ('ODIOS'),
    ('PACHO'), ('PACTA'), ('PACTO'), ('PADEL'), ('PADRE'), ('PAGAN'), ('PAGAR'), ('PAGAS'), ('PAGOS'), ('PAGUE'), ('PAISA'), ('PAJAR'),
    ('QUEMA'), ('QUEME'), ('QUEMO'), ('QUENA'), ('QUESO'), ('QUIEN'), ('QUISO'),
    ('RABAS'), ('RABIA'), ('RACHA'), ('RACIO'), ('RACON'), ('RADAR'), ('RADIA'), ('RADIO'),
    ('SABEN'), ('SABER'), ('SABES'), ('SABIA'), ('SABIO'), ('SABLE'), ('SABOR'), ('SABRA'), ('SABRE'), ('SACAR'), ('SACAS'), ('SACIA'), ('SACIO'), ('SACOS'), ('SACRA'), ('SACRO'),
    ('TABLA'), ('TACHA'), ('TACHE'), ('TACHO'), ('TACIA'), ('TACIO'), ('TACON'), ('TACOS'), ('TACTO'), ('TADEO'),
    ('UBERA'), ('UBERO'), ('UBICA'), ('UBICO'),
    ('VACAS'), ('VACIA'), ('VACIE'), ('VACIO'), ('VAGAR'), ('VAGAS'), ('VAGOS'),
    ('WATTS'),
    ('YACAL'), ('YACEN'), ('YACER'), ('YACES'), ('YAPAS')
) AS words(word)
ON CONFLICT (game_mode_id, word) DO NOTHING;

-- Verificar cuántas palabras se insertaron
SELECT COUNT(*) as total_palabras 
FROM game_mode_words 
WHERE game_mode_id = (SELECT id FROM game_modes WHERE name = 'classic');

