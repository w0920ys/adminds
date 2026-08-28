/**
 * 버전 문자열을 견줄 수 있는 수로 바꾸는 순수 함수. 'v0.10.1' 같은 값을
 * 정렬 기준으로 쓸 때 필요하다.
 *
 * 글자로 견주면 v0.10.0이 v0.9.0보다 앞에 온다 — 두 번째 자리에서 '1'과 '9'를
 * 견주기 때문이다. 화면에 보이는 값과 정렬 기준이 갈라지는 자리라, 칸에는
 * 'v0.10.1'을 그대로 보이고 견주기는 이 수로 한다. DataTable의 열이 cell과
 * sortValue를 따로 둔 이유가 이것이다.
 *
 * 자리마다 천 배씩 벌린다 — minor와 patch가 999까지 서로 넘치지 않는다.
 * 없는 자리는 0으로 본다('v1'은 v1.0.0과 같은 수다). 앞의 'v'는 있어도 없어도
 * 된다 — 이 저장소는 'v0.9.0'으로 적지만 규칙을 그 표기에 묶어 두지 않는다.
 */
export function versionOrder(version: string): number {
  const [major = 0, minor = 0, patch = 0] = version.replace(/^v/, '').split('.').map(Number)
  return major * 1_000_000 + minor * 1_000 + patch
}
