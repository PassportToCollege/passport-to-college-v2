import { RawDraftContentState } from 'draft-js';

export const IsRawDraftContentState = (content: RawDraftContentState | string):
  content is RawDraftContentState => {
    if (typeof content !== 'string' &&
      content.blocks.length) {
        return true;
      }

    return false;
  };