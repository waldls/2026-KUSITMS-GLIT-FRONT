import { NICKNAME_CHARS_REGEX } from "@/constants/regex";

export const getNicknameError = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!NICKNAME_CHARS_REGEX.test(value)) return "한글, 영문, 숫자만 사용할 수 있어요.";
  if (value.length < 2) return "두 글자 이상 입력해주세요.";
  return undefined;
};
