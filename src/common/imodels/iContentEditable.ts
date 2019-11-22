import { RawDraftContentState } from 'draft-js';

export default interface iContentEditable {
  text: string;
  editable: RawDraftContentState;
}