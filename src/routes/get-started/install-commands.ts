/**
 * Install 문서가 보이는 npm 스크립트.
 *
 * 명령 문자열을 화면에 적는 대신 스크립트 이름만 두고 'npm run {script}'로
 * 조립한다. 그 이름이 package.json에 실재하는지는 테스트가 지킨다 —
 * package.json 자체를 앱에 들이지 않으면서 문서가 없는 명령을 시키는 일을
 * 막는 방법이다.
 */
export type InstallCommand = {
  script: string
  note: string
}

export const installCommands: InstallCommand[] = [
  { script: 'dev', note: '개발 서버를 띄웁니다. 이 작업대를 브라우저에서 보는 방법입니다.' },
  { script: 'build', note: '타입을 검사하고(tsc -b) 프로덕션 번들을 만듭니다. 타입이 깨지면 여기서 멈춥니다.' },
  { script: 'test', note: 'vitest를 한 번 돌립니다. DOM 없이 도는 순수 로직만 덮습니다.' },
  { script: 'registry', note: 'registry.json에서 public/r/을 다시 만듭니다. 컴포넌트를 고친 뒤 이 명령을 돌려야 바깥에 닿습니다.' },
]
