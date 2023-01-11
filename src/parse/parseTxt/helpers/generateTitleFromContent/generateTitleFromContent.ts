import {
  PROLOGUE,
  CHARACTERS_INTRODUCTION,
  CONTENT_INTRODUCTION,
} from "../../constants";

export default (content: string[]) => {
  for (let i = 0; i < content.length; i += 1) {
    if (content[i].indexOf(PROLOGUE)) {
      return PROLOGUE;
    }
    if (content[i].indexOf(CHARACTERS_INTRODUCTION)) {
      return CHARACTERS_INTRODUCTION;
    }

    if (content[i].indexOf(CONTENT_INTRODUCTION)) {
      return CONTENT_INTRODUCTION;
    }
  }

  return PROLOGUE;
};
