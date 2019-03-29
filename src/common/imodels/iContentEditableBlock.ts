export default interface iContentEditableBlock {
  key : string;
  data : any;
  depth : number;
  entityRanges : [];
  inlineStyleRanges : [];
  text : string;
  type : string;
}