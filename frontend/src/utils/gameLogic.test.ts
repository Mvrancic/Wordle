import { evaluateGuess, pickUniqueRandomWords, submitMultiGuess, MultiBoardState } from './gameLogic';

describe('evaluateGuess', () => {
  it('marks exact matches as correct', () => {
    expect(evaluateGuess('CRANE', 'CRANE')).toEqual([
      'correct', 'correct', 'correct', 'correct', 'correct',
    ]);
  });

  it('marks letters in the wrong position as present', () => {
    // "ECRAN" uses the exact same letters as "CRANE" but none in their
    // original spot, so every letter should come back present.
    expect(evaluateGuess('ECRAN', 'CRANE')).toEqual([
      'present', 'present', 'present', 'present', 'present',
    ]);
  });

  it('handles duplicate letters without over-counting', () => {
    // Answer "APPLE" has two P's; guess "PAPER" should get one correct P
    // (position 2) and one present P (position 0), not two corrects/presents.
    expect(evaluateGuess('PAPER', 'APPLE')).toEqual([
      'present', 'present', 'correct', 'present', 'absent',
    ]);
  });
});

describe('pickUniqueRandomWords', () => {
  const wordList = ['CRANE', 'BLAST', 'SNIPE', 'GHOST', 'PLANT'];

  it('returns the requested number of words', () => {
    expect(pickUniqueRandomWords(wordList, 4)).toHaveLength(4);
  });

  it('never repeats a word within one selection', () => {
    const words = pickUniqueRandomWords(wordList, 4);
    expect(new Set(words).size).toBe(words.length);
  });

  it('caps out at the size of the word list', () => {
    expect(pickUniqueRandomWords(['CRANE', 'BLAST'], 4)).toHaveLength(2);
  });
});

describe('submitMultiGuess', () => {
  function makeBoards(targetWords: string[]): MultiBoardState[] {
    return targetWords.map((targetWord) => ({ targetWord, attempts: [], solved: false }));
  }

  it('evaluates one guess against every board', () => {
    const boards = makeBoards(['CRANE', 'BLAST']);
    const next = submitMultiGuess(boards, 'CRANE');

    expect(next[0].attempts).toHaveLength(1);
    expect(next[1].attempts).toHaveLength(1);
    expect(next[0].solved).toBe(true);
    expect(next[1].solved).toBe(false);
  });

  it('locks solved boards so they stop receiving attempts', () => {
    let boards = makeBoards(['CRANE', 'BLAST']);
    boards = submitMultiGuess(boards, 'CRANE'); // solves board 0, board 1 gets its 1st attempt
    boards = submitMultiGuess(boards, 'BLAST'); // board 0 is locked, solves board 1 on its 2nd attempt

    expect(boards[0].attempts).toHaveLength(1); // locked after solving, never grows again
    expect(boards[1].attempts).toHaveLength(2);
    expect(boards.every((b) => b.solved)).toBe(true);
  });

  it('is case-insensitive', () => {
    const boards = makeBoards(['CRANE']);
    const next = submitMultiGuess(boards, 'crane');
    expect(next[0].solved).toBe(true);
  });
});
