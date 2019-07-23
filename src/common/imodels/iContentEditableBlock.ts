export default interface iContentEditableBlock {
  key: string;
  data: any;
  depth: number;
  entityRanges: unknown[];
  inlineStyleRanges: unknown[];
  text: string;
  type: string;
}