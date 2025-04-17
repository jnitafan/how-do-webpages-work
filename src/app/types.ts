export interface PageHandle {
  enterAnimation: (onComplete: () => void) => void;
  exitAnimation: (onComplete: () => void) => void;
}
