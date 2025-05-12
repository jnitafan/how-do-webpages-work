export interface pageHandle {
  enterAnimation: (onComplete: () => void) => void;
  exitAnimation: (onComplete: () => void) => void;
}
