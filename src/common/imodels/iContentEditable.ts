import iContentEditableBlock from "./iContentEditableBlock";

export default interface iContentEditable {
  blocks: iContentEditableBlock[];
  entityMap? : unknown;
}