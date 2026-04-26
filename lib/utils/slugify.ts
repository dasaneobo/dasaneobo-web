export function generateSlug(title: string): string {
  if (!title) return '';

  return title
    // 한글, 영문, 숫자 외의 특수문자 제거 (공백 제외)
    .replace(/[^\w\s\uAC00-\uD7A30-9]/g, '')
    // 연속된 공백을 단일 공백으로
    .replace(/\s+/g, ' ')
    .trim()
    // 공백을 하이픈으로 변경
    .replace(/\s/g, '-')
    // 연속된 하이픈 단일화
    .replace(/-+/g, '-')
    // 60자 이내로 자르기
    .substring(0, 60)
    // 끝이 하이픈으로 끝나면 제거
    .replace(/-$/, '')
    .toLowerCase();
}
