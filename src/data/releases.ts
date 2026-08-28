export type ReleaseChange = {
  target: string
  type: 'New' | 'Updated' | 'Fixed'
  note: string
}

export type ReleaseRequest = {
  label: string
  done: boolean
}

export type ReviewItem = {
  label: string
  category: string
  completed: boolean
}

export type Release = {
  version: string
  publishedAt: string
  title: string
  purpose: string
  changes: ReleaseChange[]
  requests: ReleaseRequest[]
  reviewItems: ReviewItem[]
  impact: string[]
}

/** 최신 버전이 배열의 맨 앞이다. */
export const releases: Release[] = [
  {
    version: 'v0.15.0',
    publishedAt: '2026-08-29',
    title: '모바일 헤더·서랍 순서를 바꾸고 사이트 푸터를 다시 짰어요',
    purpose:
      '모바일 헤더의 메뉴 버튼이 테마 토글 뒤로 옮겨졌고, LNB 서랍이 오른쪽에서 열리며 섹션 목록·문서 목록 두 단계로 나뉘었어요. 사이트 푸터도 문서 하단 이동 영역과 전체 푸터 두 곳이 다시 짜였어요.',
    changes: [
      { target: 'Gnb', type: 'Updated', note: '모바일 헤더에서 메뉴 버튼을 테마 토글 뒤로 옮겼어요.' },
      { target: 'Lnb', type: 'Updated', note: '모바일 서랍이 오른쪽에서 열리고, 섹션 목록과 문서 목록 두 단계로 나뉘었어요.' },
      { target: 'DocFooterNav', type: 'Updated', note: '문서 하단 이동 영역 위 구분선을 없앴어요.' },
      { target: 'SiteFooter', type: 'Updated', note: '로고+copyright와 메뉴 2컬럼으로 다시 짰어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Foundations', 'Components', 'Patterns', 'Get started', 'Updates'],
  },
  {
    version: 'v0.14.0',
    publishedAt: '2026-08-28',
    title: '본문 기본값을 16px로 올리고 스케일 열두 단계를 다시 짰어요',
    purpose:
      '본문 기본값이 14에서 16으로 올랐고, 전체 글자 크기 스케일을 픽셀 이름을 쓰는 열두 단계로 다시 정의했어요.',
    changes: [
      { target: 'Foundations / Typography', type: 'Updated', note: '스케일 표를 새 열두 단계(11~48)로 다시 썼어요.' },
      { target: '제목류', type: 'Updated', note: '소제목 18, 다이얼로그류 제목 20, 페이지 제목 32, 섹션 제목 22로 옮겼어요.' },
      { target: '통계·개수 표시', type: 'Updated', note: '강조 숫자 티어(32/40/48)로 옮기고 굵기를 bold로 맞췄어요.' },
      { target: 'Patterns 예시 제목', type: 'Updated', note: '상세 28, 목록 24로 갈라 뒀어요.' },
      { target: '제품 컴포넌트 · 레이아웃', type: 'Updated', note: '본문을 16으로 올리고, Table 등 조밀한 자리는 14로 남겼어요.' },
      { target: '문서 전시 시스템 · 컴포넌트 문서 페이지', type: 'Updated', note: '본문을 16으로 올렸어요.' },
      { target: 'cn 유틸', type: 'Fixed', note: 'text-11 같은 픽셀 크기 클래스가 뒤따르는 색 클래스에 지워지던 것을 고쳤어요.' },
      { target: 'Registry', type: 'Fixed', note: 'Dialog·Sheet 등 해부도 설명이 옛 클래스명(text-sm·text-lg 등)을 그대로 적고 있던 것을 실제 클래스로 고쳤어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Foundations', 'Components', 'Patterns', 'Get started', 'Updates'],
  },
  {
    version: 'v0.13.0',
    publishedAt: '2026-08-28',
    title: 'Data Table을 싣고 Table이 약속한 정렬을 코드로 지켰어요',
    purpose:
      '목록 화면마다 다시 짜던 정렬·페이지 나눔·선택을 한 벌로 묶은 Data Table을 새로 실었고, Table은 정렬 머리와 aria-sort를 갖게 됐으며 List 패턴은 그 위로 옮겨 갔어요.',
    changes: [
      { target: 'Data Table', type: 'New', note: '정렬·페이지 나눔·선택 세 상태를 한 컴포넌트가 맡아요. 셋 다 비제어가 기본이고, 같은 이름의 prop을 주면 그때부터 부모가 쥐어요.' },
      { target: 'Table', type: 'Updated', note: 'TableHead가 sortable·sortDirection을 받아 정렬 머리를 그리고, 정렬 가능한 열에만 aria-sort를 실어요. 다음 방향은 받은 값을 보여줄 뿐 스스로 계산하지 않아요.' },
      { target: 'List', type: 'Updated', note: '표·정렬·선택·페이지를 손으로 조립하던 자리를 Data Table 하나로 바꿨어요. 예시 행은 이 저장소의 컴포넌트 서른아홉 개를 그대로 써서, 페이지를 넘겨도 선택이 남는 것을 눌러서 볼 수 있어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Components', 'Patterns', 'Updates'],
  },
  {
    version: 'v0.12.0',
    publishedAt: '2026-08-27',
    title: '덮는 것, 묻는 것, 접는 것 여섯을 더했어요',
    purpose:
      '어드민에서 늘 나오는데 이 시스템에 없던 여섯을 더했어요. 가장자리에서 열리는 Sheet, 실수로 닫히지 않는 Alert Dialog, 눌려 있는 버튼 Toggle과 그 묶음, 접히는 자리 하나를 위한 Collapsible, 크기가 정해진 상자를 위한 Scroll Area, 그리고 쳐서 찾아 곧장 가는 Command예요. 여섯 중 Sheet는 이미 있는 Dialog 패키지를 다시 쓰고 Command는 패키지 없이 이 저장소가 이미 하던 방식(순수 함수 + Dialog)으로 세워서, 새로 들인 패키지는 다섯이에요. 만들고 나서 소스로 다시 확인해 고친 자리가 다섯인데, 둘은 지침이 경고하는 결함을 그 지침의 예시가 그대로 저지르고 있던 것(Toggle·Collapsible), 하나는 적어 둔 근거가 실제 소스와 달랐던 것(Destructive confirm), 둘은 실제로 잘못 그려지거나 잘못 짚던 것(Scroll Area·Command)이었어요. 마지막으로 브랜치 전체를 한 번 더 훑어 셋을 더 고쳤어요 — 문서가 약속한 줄바꿈을 ToggleGroup이 실제로는 하지 않던 것, Command·Combobox가 키보드로 짚은 항목을 보이는 곳으로 끌어오지 않던 것, 그리고 pointer-events-none과 함께 걸려 서로를 지우던 cursor-not-allowed 셋이에요.',
    changes: [
      { target: 'Sheet', type: 'New', note: '가장자리에 붙은 Dialog예요. 새 패키지 없이 이미 있는 @radix-ui/react-dialog를 다시 썼어요. dialog.tsx를 고쳐 겸용하지 않은 것은 DialogContent가 덮개를 가운데 정렬 그릇으로 쓰기 때문이에요 — 한 파일에서 두 배치를 분기로 다루면 두 컴포넌트의 규칙이 섞여요. 네 방향과 세 크기를 갖는데 축으로는 두지 않았어요 — 닫힌 트리거에서는 일곱 값이 전부 똑같아 보여 격자에 담기지 않거든요. Dialog가 size를 축에서 뺀 것과 같은 이유예요.' },
      { target: 'Alert Dialog', type: 'New', note: 'Dialog의 variant로 두지 않고 자기 컴포넌트로 뒀어요. 차이가 보이는 게 아니라 동작하는 거라서요 — 바깥을 눌러도 닫히지 않고, 접근성 트리에서 alertdialog로 읽히고, 나가는 길이 취소 하나예요. 닫기 X를 두지 않았어요. X는 취소인지 그냥 닫기인지 말하지 않거든요. size 축도 두지 않았어요 — 경고가 길어질 자리를 만들지 않으려고요.' },
      { target: 'Toggle', type: 'New', note: '눌려 있는 버튼 하나와 그 묶음이에요. 문서도 레지스트리 항목도 하나로 두고 파일 둘을 함께 실어요 — 둘의 차이가 값이 하나인지 여럿인지뿐이라 축 하나로 표현되거든요. toggleVariants는 toggle.tsx가 정의해 내보내고 toggle-group.tsx가 그대로 쓰며, 크기는 묶음이 정한 것을 항목이 ToggleGroupContext로 따라요 — 항목에 따로 넘겨 주지 않는 한 한 묶음 안에서 크기가 갈리지 않아요. Switch와 겹치지 않아요 — Switch는 설정을 켜고 그 자리에서 저장되고, Toggle은 지금 보고 있는 것에 서식이나 필터를 걸어요.' },
      { target: 'Collapsible', type: 'New', note: '접히는 자리가 하나일 때 쓰는 거예요. Accordion은 트리거를 h3으로 감싸서, 접히는 자리가 하나뿐인데 Accordion을 쓰면 있지도 않은 절이 하나 생겨요. Collapsible에는 그 머리글 요소가 없어서 카드 안이든 표 행 안이든 제목 층위를 만들지 않고 놓을 수 있어요. Indicator는 Trigger 안에서 그려져 밖에서 닿을 수 없어, Switch의 thumbProps와 같은 자리에 indicatorProps 통로를 두어 Anatomy 미리보기가 지시선을 그릴 수 있게 했어요.' },
      { target: 'Scroll Area', type: 'New', note: '크기가 정해진 상자 안에서만 굴러가요. 굴리는 일은 브라우저가 그대로 하고 Radix는 스크롤바만 다시 그려요 — 기본 스크롤바가 운영체제마다 다르게 생기고 다크 모드에서 색이 안 따라와서요. Thumb 색은 shadcn이 쓰는 bg-border를 그대로 두지 않고 bg-muted-foreground로 갈랐어요. bg-border는 트랙 뒤 배경과 대비가 1.2:1 안팎이라 사실상 안 보였거든요. 지침 둘도 함께 적었어요 — 막대를 감추기만 할지(scrollbar-none) 감추는 대신 새로 그릴지(ScrollArea)를 가르는 기준, 그리고 Radix가 Viewport에 tabIndex를 주지 않아 키보드 통로를 안에 놓인 포커스 가능한 요소로 만들어야 한다는 것이에요 — 내용이 실제로 넘치면 브라우저가 스크롤 컨테이너 자체를 포커스 가능하게 다뤄 Tab으로 닿기도 하지만(Chrome 127+), 넘치지 않는 상자는 그 대상이 아니고 브라우저마다 달라요.' },
      { target: 'Command', type: 'New', note: 'shadcn은 이걸 cmdk로 만드는데 여기서는 패키지를 들이지 않았어요. 이 저장소는 같은 일을 Combobox와 SearchDialog에서 이미 두 번 손으로 했고, 패키지를 들이면 cmdk의 필터 규칙이 filterOptions의 규칙과 갈려 한 저장소 안에서 두 검색이 다르게 걸러져요. 거르고 묶고 펴는 일은 command-filter.ts의 순수 함수 셋으로 빼서 테스트가 지켜요 — 그중 flattenCommandSections가 화면에 그려지는 순서와 원본 배열 순서를 가르는 자리예요. 묶음 머리글은 제목 요소로 그리지 않아요 — Command는 포털을 쓰지 않고 main 안에 놓여서, h3을 쓰면 오른쪽 목차가 그걸 문서의 절로 잡아요.' },
      { target: 'Destructive confirm', type: 'Updated', note: '삭제 확인 패턴을 Dialog에서 Alert Dialog로 옮겼어요. Alert Dialog가 실린 순간 이 패턴이 "Dialog로 묻는다"고 말하는 게 거짓이 됐거든요 — 화면에서 눈으로 잡히지 않는 종류의 거짓이라 미루지 않았어요. 실행 실패 케이스 하나만 Button을 그대로 뒀어요. 그 자리 문구가 "대화상자는 닫지 않고 다시 시도할 수 있게 둔다"인데, AlertDialogAction도 onClick에서 event.preventDefault()를 부르면 닫히지 않기는 해요. 다만 그러려면 누를 때마다 기본 동작을 눌러 두는 우회로가 필요해서 Button으로 뒀고, 처음에 "막을 방법이 없다"고 적었던 주석은 Radix 소스를 읽고 정정했어요.' },
      { target: 'Scroll Area', type: 'Fixed', note: 'orientation="both"에서 세로·가로 스크롤바가 모서리에서 겹치던 것을 고쳤어요. Radix가 인라인으로 주는 top:0·bottom:var(--radix-scroll-area-corner-height)가 코너 자리를 이미 정하는데 거기에 h-full·w-full까지 얹으면 세 값이 모두 정해지는 과잉 제약이라 브라우저가 bottom·right를 버려요(CSS 2.1 §10.6.4). 두 클래스를 떼서 Radix의 오프셋만으로 크기가 정해지게 했어요. 해부도의 Thumb 설명이 아직 bg-border라고 적혀 있던 것도 함께 고쳤어요.' },
      { target: 'Command', type: 'Fixed', note: '위아래로 짚는 순서가 화면 순서가 아니라 원본 배열 순서였어요. 묶음이 원본에서 뒤섞여 있으면(A(X)·B(Y)·C(X)) 화면은 A·C·B로 그리는데 짚는 것은 A·B·C라, 아래로 갈 때 화면의 세 번째로 건너뛰고 그다음엔 앞선 항목으로 되돌아갔어요. command-filter.ts에 flattenCommandSections를 더해 화면 순서 위에서 짚게 했고, 뒤섞인 묶음 픽스처로 먼저 실패하는 테스트를 짠 뒤에 고쳤어요. groups-are-labels 지침의 DO가 묶음을 하나만 보이던 것도 둘로 고쳤어요.' },
      { target: 'Toggle · Collapsible 예시', type: 'Fixed', note: '두 문서의 DON\'T 예시가 지침이 경고하는 결함을 그대로 띄우고 있었어요. Toggle 쪽은 이름 없는 아이콘 토글이 실제로 포커스되고 탭 순서에 들어갔고, Collapsible 쪽은 진짜 Accordion이 h3 트리거를 DOM에 남겼어요. 둘 다 inert를 얹어 생김새는 그대로 두되 클릭도 포커스도 받지 않고 접근성 트리에서도 빠지게 했어요 — aria-hidden은 포커스 가능한 요소에 붙이면 그 자체로 결함이라 답이 될 수 없거든요. Collapsible 쪽 근거도 함께 정정했어요. 목차는 아코디언 h3을 이미 걸러 내므로 목차가 오염되는 게 아니라, h3 자체는 DOM에 남고 화면 낭독기의 제목 탐색이 태그를 훑는 게 문제였어요.' },
      { target: 'Properties 격자', type: 'Fixed', note: 'PropertyBlock의 격자 칸이 min-width:auto인 채로 가로로 굴러가는 넓은 내용을 품으면, 375px 화면에서 main 전체가 스크롤바 없이 가로로 밀렸어요. Scroll Area의 horizontal 예시를 실으면서 드러났고, ExampleList가 같은 문제를 이미 min-w-0으로 막고 있던 것과 같은 처방을 썼어요.' },
      { target: 'Toggle Group', type: 'Fixed', note: '문서 두 줄이 "줄바꿈된다"고 말하는데 컴포넌트는 줄바꿈하지 않았어요. 기본 클래스에 flex-wrap이 없어서, 항목 일곱을 160px 상자에 넣으면 한 줄로 381px까지 늘어나 상자를 그대로 넘쳐 흘렀어요. 문서 화면에서는 예시가 flex-wrap을 스스로 얹어 그 사실을 가리고 있었고요. 컴포넌트에 flex-wrap을 넣었더니 같은 상자에서 160px 세 줄로 접히고, 넓은 자리에서는 w-fit(= fit-content)이라 여전히 381px 한 줄이에요 — 두 케이스 문구가 이제 둘 다 참이에요. 예시가 덧붙이던 클래스는 걷어냈고, 좁은 화면 예시는 항목이 셋뿐이라 160px 안에 그냥 들어가 버려서 하나를 더해 실제로 접히게 했어요. 레지스트리로 나가는 파일이라 받는 쪽에서도 같은 문제였어요.' },
      { target: 'Command · Combobox', type: 'Fixed', note: '키보드로 짚은 항목이 목록 상자 밖으로 나가도 따라 굴러가지 않았어요. 포커스는 검색 칸에 머물고 짚은 자리는 aria-activedescendant로만 알리는 방식이라, 브라우저가 포커스를 따라 굴려 주는 일이 여기서는 일어나지 않거든요. 짚은 항목이 바뀔 때 scrollIntoView로 직접 끌어오게 했어요 — 이미 보이는 항목은 건드리지 않도록 nearest로요. SearchDialog가 이미 같은 방법을 쓰고 있어서 이제 셋이 같은 규칙이에요.' },
      { target: 'Command · Combobox · Date Picker', type: 'Fixed', note: '켜질 수 없는 클래스를 걷어냈어요. Command 항목·Combobox 트리거·Date Picker 트리거의 cursor-not-allowed요. 같은 요소에 pointer-events-none이 함께 걸리면 히트 테스트를 받지 않아 커서 모양이 적용될 수 없어서, 나머지 컨트롤이 이미 쓰는 pointer-events-none + opacity-50만 남겼어요.' },
      { target: 'Registry', type: 'Updated', note: 'registry.json에 컴포넌트 여섯과 순수 함수 하나(command-filter)를 더했어요. Toggle은 toggle.tsx와 toggle-group.tsx 두 파일을 한 항목으로 실어요. adminds 묶음도 서른여덟 개를 전부 가리키게 갱신했어요. 구운 payload를 지키는 테스트도 넓혔어요 — 그전에는 files[].content만 견줘서, 파일이 없는 항목(registry.json에서는 adminds 묶음 하나예요)은 payload가 낡아도 아무것도 잡지 못했거든요. 항목 메타까지 대조하게 했고, 손으로 적는 개수("서른여덟 개"·README의 "38개 전부")도 실제 컴포넌트 수와 견주게 했어요.' },
      { target: 'README', type: 'Fixed', note: '레지스트리 묶음을 받는 명령 옆에 "32개 전부"라고 적어 둔 게 또 낡아 있었어요. registry.ts와 registry.json에서 세어 실제 개수인 38개로 고쳤어요.' },
    ],
    requests: [
      { label: '컴포넌트를 이어서 더해 주세요 — Sheet·Alert Dialog·Toggle·Collapsible·Scroll Area·Command 여섯', done: true },
    ],
    reviewItems: [
      { label: 'SearchDialog를 Command 위로 옮길 수 있는가 — 결과 한 줄의 생김새(강조·경로·New 배지)를 제품 컴포넌트가 알게 하지 않으면서', category: 'Components', completed: false },
      { label: '이번에 들어온 여섯 중 Command만 verified다 — 나머지 다섯을 눈으로 확인해 올릴 시점이 언제인가', category: 'Components', completed: false },
      { label: 'Alert Dialog가 실렸는데 Dialog 문서는 아직 destructive 축과 삭제 확인·대량 작업 확인 Usage를 자기 것으로 갖고 있고, Form 패턴의 unsaved-changes 케이스도 Dialog로 묻는다 — 어느 쪽으로 정리할 것인가', category: 'Components', completed: false },
      { label: '덮는 것 셋의 높이 처방이 서로 다르다 — SheetContent만 overflow-y-auto를 갖고 DialogContent·AlertDialogContent에는 높이 상한도 overflow도 없어, 긴 본문은 예시가 스스로 max-h를 얹어 막고 있다. 셋을 언제 한 번에 맞출 것인가', category: 'Components', completed: false },
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림, ScrollArea Viewport에 tabIndex와 이름을 주어 순수 텍스트 상자의 키보드 통로를 브라우저에 맡기지 않는 것)을 언제 다룰 것인가', category: 'Components', completed: false },
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '패턴 문서의 Example이 커서 List·Detail 두 파일이 사백 줄을 넘는다 — 조각을 나눌 자리가 어디인가', category: 'Patterns', completed: false },
      { label: '다섯 패턴이 모두 draft다 — 눈으로 확인을 마치고 verified로 올릴 시점이 언제인가', category: 'Patterns', completed: false },
    ],
    impact: ['Components', 'Patterns', 'Updates'],
  },
  {
    version: 'v0.11.0',
    publishedAt: '2026-08-27',
    title: '첫 화면과 Patterns를 채워 GNB의 빈 자리를 없앴어요',
    purpose:
      'GNB에서 마지막까지 비어 있던 두 섹션을 채웠어요. Get started는 여기가 무엇이고 어디서부터 읽는지, 어떻게 띄우고 어떤 원칙을 따르는지를 Overview·Install·Principles 세 문서로 나눴어요. Patterns는 Overview와 함께 목록·상세·입력·빈 자리·확인 다섯 문서를 실었는데, 예시 화면을 그림으로 그리지 않고 이미 있는 컴포넌트로 실제로 조립했어요 — 토큰이 바뀌면 예시도 따라 바뀌어요. 이로써 문서 라우트에서 자리표시자가 사라졌고, 그 사실을 뒤늦게 거짓이 되는 문장 몇 개도 이번에 함께 걷어냈어요.',
    changes: [
      { target: 'Get started', type: 'New', note: 'v0.3.0에서 GNB에 Get started가 생긴 뒤로 아홉 회차 동안, 방문자가 처음 보는 화면이 자리표시자였어요. 섹션 목록도 섹션마다의 문서 개수도 컴포넌트·패턴 수도 전부 nav-config와 registry, patterns에서 세어 보여줘요. 섹션이 늘었는데 설명이 빠지는 일을 막으려고, 설명 표의 키가 GNB의 섹션과 정확히 같은지 테스트가 지켜요.' },
      { target: 'Install', type: 'New', note: '이 작업대를 로컬에서 띄우는 법과 토큰을 제품으로 가져가는 법을 나눠 적었어요. 명령을 통째로 적지 않고 스크립트 이름만 두어 npm run 뒤에 붙이고, 그 이름이 package.json에 실재하는지 테스트가 지켜요. 폰트 스택은 여기 적지 않고 Typography 문서를 가리켜요 — 같은 값을 두 곳에 적으면 한쪽이 낡아요.' },
      { target: 'Principles', type: 'New', note: '원칙 여섯에 이름을 붙였어요. 새로 만든 건 하나도 없고 전부 이미 다른 문서에서 지키던 것이라, 원칙마다 그 근거 문서를 가리켜요. 가리키는 문서가 LNB에 실재하는지 테스트가 지켜요. 여섯 중 다섯은 제품 화면에 거는 규칙이고 마지막 하나는 이 작업대 자체에 거는 규칙이라, 절을 나눠 그 차이를 말해요.' },
      { target: 'Patterns', type: 'New', note: '패턴 문서의 뼈대 PatternPage와 데이터 patterns.ts를 새로 만들고, 카드 목록이 patterns.ts에서 파생하는 Overview를 함께 실었어요. 패턴에는 축도 상태도 없어서 ComponentPage를 재사용하지 않았어요 — 그 자리를 빈 배열로 두면 빈 절이 생기고, v0.8.0에서 이미 한 번 걷어낸 결함이거든요. Structure가 가리키는 컴포넌트 id가 registry에 실재하는지도 테스트가 지켜요.' },
      { target: 'List', type: 'New', note: '여러 항목을 훑고 걸러 하나를 고르는 화면이에요. 필터와 결과 수, 선택과 대량 작업 줄, 페이지 이동까지 Breadcrumb·Button·Input·Select·Table·Checkbox·Badge·Avatar·Pagination을 실제로 조립했어요.' },
      { target: 'Detail', type: 'New', note: '항목 하나를 갈래로 나눠 보이는 화면이에요. 탭은 한 대상의 정보를 나누는 것이지 다른 화면으로 가는 것이 아니라, 제목과 동작을 Tabs 위에 두고 탭을 바꿔도 그 줄이 남는 것을 Example과 Guidelines 양쪽에서 보여요. 위험한 동작은 Dropdown Menu 안쪽에 둬요.' },
      { target: 'Form', type: 'New', note: '라벨·도움말·오류의 배치를 정하는 입력 화면이에요. 그 셋을 컨트롤에 잇는 일은 v0.10.0에서 들어온 Field가 맡아요 — 라벨이 컨트롤 오른쪽에 오는 세 자리만 htmlFor를 직접 짝지었고, 그 이유를 주석으로 남겼어요. Switch와 Checkbox의 차이는 모양이 아니라 시점이라는 것도 지침으로 적었어요.' },
      { target: 'Empty and error', type: 'New', note: '아직 아무것도 없는 것은 정상이고 불러오지 못한 것은 사고예요. EmptyState의 네 variant가 그대로 이 패턴의 네 경우여서 나란히 놓았는데, 그중 둘(empty·no-results)은 색이 같아요. 그래서 무엇이 다른지는 색이 아니라 문구가 말하게 했어요.' },
      { target: 'Destructive confirm', type: 'New', note: '되돌릴 수 없는 동작을 실행하기 전에 한 번 멈추는 흐름이에요. Dialog로 묻고 Toast로 알리는 것을 그 자리에서 눌러 볼 수 있어요. 제목은 대상을 말하는 자리로 두고 되돌릴 수 없다는 말은 본문에 뒀으며, 본문이 그렇게 말하므로 Toast에 되돌리기를 두지 않았어요. 375px에서 지침 칸을 넘치던 고정폭 Toast는 이 문서에서만 줄어들 수 있게 고쳤어요.' },
      { target: 'DocStatus', type: 'New', note: 'ComponentPage 안에 박혀 있던 상태 배지 줄을 뽑아 PatternPage와 나눠 써요. 잰 대비값이 적힌 주석도 함께 옮겼어요 — 같은 배지가 두 곳에서 같은 뜻으로 읽혀야 하니까요.' },
      { target: 'Contents', type: 'Fixed', note: '패턴 예시 속의 가짜 화면 제목이 오른쪽 목차를 오염시키던 것을 고쳤어요. 목차는 아코디언만 빼고 main 아래의 h2·h3를 모두 훑는데, 예시가 화면 제목을 흉내내려 h3를 써서 어느 절도 가리키지 않는 항목이 목차에 잡혔어요. ButtonPage가 이미 같은 자리에서 h4를 쓰고 있어 그 선례를 따랐고, className은 그대로 둬 시각적 무게는 유지했어요.' },
      { target: 'Foundations / Components', type: 'Fixed', note: '두 Overview가 화면 단위의 규칙은 "Patterns의 몫입니다. 그 문서는 아직 준비 중입니다"라고 말하고 있었어요. 이번 회차로 거짓이 되므로 함께 고쳤어요.' },
      { target: 'Updates', type: 'Fixed', note: '이 화면의 설명이 버전 표시를 "사이드바 아래 상자"에서 가져온다고 말하고 있었어요. 그 상자는 v0.10.0에서 걷히고 버전 번호가 GNB로 옮겨 갔는데 문장만 남아 있었어요. 실제로 그리는 자리에 맞춰 고쳤어요.' },
      { target: 'Placeholder', type: 'Fixed', note: '"이 문서는 아직 준비 중입니다"라고 적혀 있었어요. Principles까지 채우면서 준비 중인 문서가 하나도 남지 않아, 이제 이 자리표시자는 없는 주소와 메타를 찾지 못한 문서에만 쓰여요. 두 경우 모두에 대해 사실인 문구로 바꾸고 공사 중 아이콘도 함께 바꿨어요.' },
      { target: 'README', type: 'Fixed', note: '레지스트리 묶음을 받는 명령에 "26개 전부"라고 적어 둔 게 낡아 있었어요. registry.ts와 registry.json이 가리키는 실제 개수인 32개로 고쳤고, 폴더 구조 설명에 빠져 있던 get-started·patterns 폴더와 새 컴포넌트를 더할 때 함께 고쳐야 하는 nav-config도 채웠어요.' },
    ],
    requests: [
      { label: '남은 작업을 이어서 해주세요 — Get started와 Patterns를 채우는 쪽으로', done: true },
    ],
    reviewItems: [
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '패턴 문서의 Example이 커서 List·Detail 두 파일이 사백 줄을 넘는다 — 조각을 나눌 자리가 어디인가', category: 'Patterns', completed: false },
      { label: '다섯 패턴이 모두 draft다 — 눈으로 확인을 마치고 verified로 올릴 시점이 언제인가', category: 'Patterns', completed: false },
    ],
    impact: ['Get started', 'Patterns', 'Foundations', 'Components', 'Updates'],
  },
  {
    version: 'v0.10.1',
    publishedAt: '2026-08-27',
    title: '문서에 숨 쉴 틈을 내고, 달력·파일·슬라이더가 상태를 제대로 알리게 했어요',
    purpose:
      '컴포넌트는 서른둘로 다 찼는데 정작 그것을 설명하는 문서가 답답하게 읽혔어요. 줄 간격과 한 줄 길이, 절 사이 여백을 shadcn 문서를 기준으로 다시 잡고 좁은 화면까지 함께 손봤어요. 이번에 새로 넣은 여백은 전부 Spacing 문서가 정한 4px 배수 눈금 위에 올렸어요 — 규칙을 적어 둔 문서가 그 규칙을 스스로 어기고 있었거든요. 곁들여 달력·파일 업로드·슬라이더가 화면에 보이는 상태를 보조기술에도 똑같이 알리도록 고쳤어요.',
    changes: [
      { target: 'Docs', type: 'Updated', note: '문서 화면의 줄 간격과 여백을 다시 잡았어요. 읽는 글이 놓이는 세 크기(text-xs·sm·base)의 줄 간격을 16/20/24px에서 20/24/28px로 올렸어요 — 셋 다 4의 배수라 여백 눈금에도 컨트롤 높이에도 어긋나지 않아요. 본문 한 줄은 856px까지 늘어나던 것을 672px에서 끊었고(무대·표·놀이터는 그대로 전폭을 써요), 절 사이 120px은 64/80px로 좁히는 대신 절 안의 간격을 올려 빽빽한 덩어리 사이에 협곡만 남던 리듬을 되돌렸어요. 문서 안에서 문장 노릇을 하던 12px 문단 스물여섯 곳도 본문 크기로 올렸어요.' },
      { target: 'Docs', type: 'Fixed', note: '절 안의 간격을 올리면서 새로 넣은 여백 열여섯 자리가 10·14·6px이라 4px 눈금에서 벗어나 있었어요. 간격은 4px 배수로만 쓴다고 적어 둔 것이 이 문서 자신이라, 12·16·8px로 옮겨 규칙과 코드를 맞췄어요. /components/button을 1440px에서 재 보니 눈금 밖 간격이 198자리에서 102자리로 줄었고, 남은 102자리는 모두 이번 작업 이전부터 있던 6px(gap-1.5) 아이콘 간격이에요.' },
      { target: 'Docs', type: 'Fixed', note: 'Design Token 화면이 방금 더한 줄 간격 토큰 둘(--text-xs--line-height·--text-base--line-height)을 "(정의되지 않음)"으로 보여주던 것을 고쳤어요. Tailwind는 이 짝 이름을 .text-<크기> 규칙 안에 값째로 박아 넣고 :root에는 내보내지 않아서, 실측만으로는 잡히지 않았어요. 실측이 비면 tokens.css에 적힌 선언을 대신 읽도록 해서, 정의된 토큰을 없다고 말하는 일이 없게 했어요.' },
      { target: 'Docs', type: 'Updated', note: '좁은 화면(640px 미만)에서 절의 본문 문단이 15px/26.25px로 한 단계 커지고 바깥 여백도 함께 넓어져요. 다만 이 규칙이 닿는 것은 절의 직계 문단과 docProse를 쓰는 문단뿐이에요 — 375px에서 재 보니 Button 8곳, Table 5곳, Color 7곳, Updates 2곳이고, 카드·표·놀이터 안에 있는 나머지 본문(같은 화면에서 각각 89·109·142·10곳)은 14px 그대로예요.' },
      { target: 'Tabs', type: 'Updated', note: '탭 트리거의 높이를 h-control-sm(32px)으로 못 박아 밀도 축에 붙였어요. 그전 32px은 padding과 본문 줄 간격이 우연히 만들던 값이라, 줄 간격을 올리자 36px로 밀렸거든요. 탭 트리거는 whitespace-nowrap이라 높이를 고정해도 글이 잘리지 않아요.' },
      { target: 'Select / Combobox / Dropdown Menu / Accordion', type: 'Updated', note: '줄 간격이 올라가면서 메뉴 줄 넷의 높이도 함께 자랐어요 — Select 항목·Combobox 옵션·Dropdown Menu 항목이 32px에서 36px로, Accordion 트리거가 52px에서 56px로(두 줄로 접히는 자리는 72px에서 80px로) 늘었어요. 넷 다 py-1.5와 text-sm 줄 상자가 높이를 만드는 같은 구조예요. 탭 트리거와 달리 이 넷은 whitespace-nowrap이 없어 글이 두 줄로 접힐 수 있어서, 높이를 고정하면 접힌 글이 잘려요. 그래서 밀도 축에 못 박지 않고 내용을 따라 자라게 뒀어요. 컨트롤 높이(32·36·40px)와 표 행 높이(48·40px), Badge(20px), Checkbox(16px), Switch(24px), 페이지네이션 항목·달력 날짜 칸(32px)은 다시 재 보니 모두 그대로예요.' },
      { target: 'Calendar', type: 'Fixed', note: '칸을 UTC 정오로 만들면서 읽기는 로컬 게터로 해서, UTC+12 이상인 표준시대에서 격자 전체가 하루씩 밀리던 것을 고쳤어요. 만드는 쪽을 로컬 정오로 옮겨 양쪽이 같은 달력을 보게 했고, 표준시 아홉 곳을 갈아 끼우는 테스트를 붙였어요. 고른 날을 알리는 aria-selected가 role="button"인 안쪽 요소에 붙어 무시되던 것도 격자의 칸으로 옮기고, 기간 선택에서는 양 끝만이 아니라 사이의 날도 함께 표시해요. 요일 머리 칸이 크기와 무관하게 w-9라 sm·default에서 열이 날짜 배지보다 넓던 것도 날짜 칸과 같은 눈금으로 맞췄어요.' },
      { target: 'File Upload', type: 'Fixed', note: '목록의 한 줄이 스스로 aria-invalid를 달고 있던 것을 고쳤어요. aria-invalid는 값을 입력하는 컨트롤의 상태라 목록의 한 줄에는 없는 상태예요. 테두리 표시는 data-invalid로 옮기고, 실패 이유는 그 줄에서 포커스를 받는 유일한 요소인 지우기 버튼의 aria-describedby로 이었어요 — 그전에는 버튼에 멈춘 스크린 리더가 무엇이 왜 실패했는지 읽을 방법이 없었어요. 오류를 나타내는 두 번째 통로였던 루트의 invalid prop도 걷어내고, 감춰 둔 네이티브 file input은 aria-hidden으로 접근성 트리에서 빼 실제 컨트롤이 dropzone 버튼 하나로 읽히게 했어요.' },
      { target: 'Slider', type: 'Fixed', note: 'Field가 오류·비활성에서 내려주던 aria-invalid와 aria-disabled가 role 없는 Radix Root에 붙어 아무 데도 닿지 않던 것을 고쳤어요. role="slider"를 단 것은 Root가 아니라 손잡이(Thumb)라, 이름·설명이 이미 지나가던 길로 둘을 함께 옮겨 달았어요. Field로 감싼 Slider에 도움말과 오류를 함께 둔 예시가 어느 페이지에도 없어 이 통로가 화면에서 확인된 적이 없었는데, Cases에 네 부위를 모두 둔 자리를 만들어 눈으로 확인할 수 있게 했어요.' },
    ],
    requests: [
      { label: '문서에 숨 쉴 틈이 없어요. shadcn을 기준으로 반응형까지 생각해서 여백과 타이포를 잡아주세요', done: true },
    ],
    reviewItems: [
      { label: '메뉴 줄 넷(Select·Combobox·Dropdown Menu 항목, Accordion 트리거)이 내용을 따라 자란다 — 고정 높이 대신 무엇으로 밀도를 묶을 것인가', category: 'Components', completed: false },
      { label: '아이콘과 라벨 사이 gap-1.5(6px)가 저장소에 일흔세 자리 남아 있다 — 4px 눈금의 8px로 함께 옮길 것인가', category: 'Foundations', completed: false },
    ],
    impact: ['Foundations', 'Components'],
  },
  {
    version: 'v0.10.0',
    publishedAt: '2026-08-26',
    title: '입력 카테고리를 열하나로 채우고, 이 저장소를 레지스트리로 다시 갖췄어요',
    purpose:
      '검색해서 고르고, 날짜를 고르고, 값을 범위로 조절하고, 파일을 올리는 네 가지 입력과 그 위에서 라벨·도움말·오류를 하나로 묶는 Field를 더해 Inputs 카테고리를 여섯에서 열하나로 채웠어요. Combobox와 Date Picker가 함께 기대는 뜨는 패널 Popover도 이번에 실었어요. 컴포넌트가 서른두 개로 늘어난 만큼 registry.json에도 여섯 항목을 마저 더했고, 문서(registry.ts)와 레지스트리(registry.json)가 어긋나면 조용히 넘어가지 않도록 양방향으로 지키는 테스트를 붙였어요.',
    changes: [
      { target: 'Popover', type: 'New', note: '뜨는 패널의 기본형이에요. @radix-ui/react-popover를 쓰고, Combobox와 Date Picker가 그 위에 얹혀요.' },
      { target: 'Field', type: 'New', note: '라벨·도움말·오류를 하나의 id 계약으로 묶어요. FieldLabel·FieldControl·FieldHelp·FieldError가 컨텍스트에서 각자 htmlFor·id·aria-describedby를 스스로 읽어 손으로 맞출 일이 없어요.' },
      { target: 'Slider', type: 'New', note: '값을 범위로 조절해요. @radix-ui/react-slider를 쓰고, 손잡이 둘로 구간도 고를 수 있어요.' },
      { target: 'Combobox', type: 'New', note: '검색해서 값을 골라요. 부분 문자열(포함)로 옵션을 거르고, multiple이면 고른 값을 배지로 보여줘요.' },
      { target: 'Date Picker', type: 'New', note: '날짜나 기간을 골라요. Popover 안에 격자를 그리고, 격자 안에서 화살표 키로 이동할 수 있어요.' },
      { target: 'File Upload', type: 'New', note: '파일을 드래그하거나 골라 올려요. 크기는 formatFileSize로 사람이 읽는 단위(B·KB·MB·…)로 보여줘요.' },
      { target: 'Registry', type: 'New', note: 'registry.json에 여섯 항목(Popover·Field·Slider·Combobox·Date Picker·File Upload)과 그 밑에서 쓰는 순수 함수 셋(calendar-lib·file-size·filter-options)을 더했어요. adminds 묶음도 서른두 개를 전부 가리키게 갱신했고, registry.ts와 registry.json이 서로 어긋나면 실패하는 테스트(registry-parity.test.ts)를 붙였어요.' },
      { target: 'Updates', type: 'New', note: 'GNB에는 있었지만 준비 중이던 Updates 화면을 채웠어요. releases.ts의 기록을 최신 버전이 맨 위로 오게 늘어놓고, 버전을 열면 그 안의 변경 사항을 대상·종류·설명으로 보여줘요. 버전끼리 견줘 볼 수 있게 여러 개를 동시에 열 수 있어요.' },
      { target: 'GNB / LNB', type: 'Updated', note: 'LNB 맨 아래 있던 버전 상자를 걷어내고, 버전 번호만 GNB의 제목 옆에 작게 붙였어요. 무엇이 바뀌었는지는 Updates 화면이 맡아요.' },
      { target: 'Contents', type: 'Fixed', note: '아코디언 항목의 이름이 문서의 절인 것처럼 오른쪽 목차에 섞여 들던 것을 고쳤어요. Radix가 트리거를 h3로 감싸는데, Updates처럼 트리거 안에 버전·제목·날짜가 나란히 놓이면 그 셋이 공백 없이 이어 붙어 읽을 수 없는 목차 항목이 됐어요. 접히는 항목은 절이 아니라 컨트롤이라 목차에서 뺐어요.' },
      { target: 'tailwind-merge', type: 'Fixed', note: '커스텀 컨트롤 높이 유틸리티(h-control-sm·h-control·h-control-lg)를 tailwind-merge가 몰라 뒤에 오는 클래스가 못 이기던 것을 size·h·min-h 세 그룹에 마저 등록했어요. 같은 틈에 있던 표의 행 높이(h-row·h-row-compact)도 h·min-h 두 그룹에 함께 등록했어요.' },
      { target: 'Field', type: 'Fixed', note: '라벨이 이름을 붙이지 못하던 컨트롤 셋(Combobox·Date Picker·Slider)을 고쳤어요. label의 htmlFor는 input·button 같은 요소에만 걸려서, 트리거가 div이거나 Radix의 span인 이 셋은 라벨을 눌러도 포커스가 가지 않고 이름도 붙지 않았어요. FieldLabel이 자기 id를 달고 FieldControl이 그것을 aria-labelledby로 내려주도록 바꿔, 어떤 컴포넌트든 같은 방식으로 이름이 붙어요.' },
      { target: 'Popover', type: 'Fixed', note: '뜨는 표면은 role="dialog"인데 이름이 없어 "이름 없는 대화상자"로 읽히던 것을 고쳤어요. Combobox와 Date Picker의 표면에 이름을 달고, 표면에 이름을 붙이는 지침을 Popover 문서에 더했어요. Combobox 트리거의 aria-haspopup도 실제로 열리는 것에 맞춰 listbox에서 dialog로 바로잡았어요.' },
      { target: 'Popover / Tooltip', type: 'Fixed', note: '아이콘 전용 버튼 안의 장식 아이콘 여섯 곳(Popover 셋·Tooltip 셋)에 aria-hidden이 빠져 있던 것을 달았어요.' },
      { target: 'Field', type: 'Fixed', note: 'horizontal에서 도움말 없이 오류만 있으면 빈 도움말 행의 gap이 위아래로 두 번 잡혀 간격이 두 배(6px 대신 12px)로 벌어지던 것을 고쳤어요.' },
    ],
    requests: [
      { label: '남은 컴포넌트를 이어서 만들어주세요', done: true },
      { label: '이 디자인시스템을 다른 서비스에서도 재활용할 수 있게 해주세요', done: true },
    ],
    reviewItems: [
      { label: 'Date Picker 격자의 화살표 이동을 겨누는 자동 테스트가 없다 — 어떻게 덮을 것인가', category: 'Components', completed: false },
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
    ],
    impact: ['Components', 'Foundations'],
  },
  {
    version: 'v0.9.0',
    publishedAt: '2026-08-26',
    title: '화면의 구조와 상태를 보여줄 여덟 개를 더하고, 찾기 쉽게 갈랐어요',
    purpose:
      '컴포넌트 열여덟 개로 다섯 카테고리가 모두 열렸지만 채워진 것은 낱개의 컨트롤뿐이었어요. 화면의 구획을 나누고 불러오는 중과 아무것도 없는 상태를 보여줄 여덟 개를 더해 그 사이를 이었어요. Skeleton과 Progress의 트랙이 놓이는 표면과 같은 값을 쓰던 토큰도 이번에 갈라놨어요.',
    changes: [
      { target: 'Card / Separator / Description List / Accordion', type: 'New', note: '화면의 구획을 나누고 키·값 쌍을 보여주는 Data Display 넷을 더했어요. Accordion은 @radix-ui/react-accordion을 써요.' },
      { target: 'Skeleton / Progress / Empty State', type: 'New', note: '불러오는 중과 아무것도 없는 상태를 보여주는 Feedback 셋을 더했어요. Progress는 @radix-ui/react-progress를 써요.' },
      { target: 'Steps', type: 'New', note: '폼이나 절차의 단계를 보여주는 Navigation 하나를 더했어요.' },
      { target: 'LNB', type: 'Updated', note: '컴포넌트 스물여섯 개를 다섯 묶음으로 갈랐어요. 분류는 registry에 이미 있었는데 정작 문서를 찾는 자리에서는 평면 목록이었어요. 하루 안에 고친 문서에는 New 배지가 붙고 자정을 넘기면 스스로 떨어져요.' },
      { target: 'Search', type: 'New', note: '컴포넌트와 문서, 토큰을 한 자리에서 찾을 수 있어요. 문서 본문이 얇아 전문 검색만으로는 \'모달\'이 Dialog에 닿지 않아서, 사람이 실제로 치는 말을 컴포넌트마다 손으로 적어 뒀어요.' },
      { target: '--muted / --muted-foreground / --neutral-on-tint', type: 'Fixed', note: '채움 토큰 --muted가 표면 토큰과 명도가 거의 같아 Skeleton과 Progress의 트랙이 카드나 스테이지 위에서 보이지 않던 것을 고쳤어요. 라이트는 --muted를 0.93으로 낮췄고, 다크는 반대로 0.32로 올렸어요 — 다크에는 표면이 셋이라 내리면 이번엔 카드 배경과 붙어서, 네 표면 모두와 갈라지는 쪽이 위였어요. 라이트에서 --muted가 어두워지며 그 위 글자의 대비가 모자라져 --muted-foreground와 --neutral-on-tint도 함께 낮췄어요.' },
      { target: 'Card', type: 'Fixed', note: '다크 elevated의 테두리 결함과 성공색 대비 부족을 고쳤어요.' },
      { target: 'Skeleton', type: 'Fixed', note: '다크 테마를 다루던 Case를 표면 위 Case로 바꿔 실제로 겹치는 표면에서 확인하게 했어요.' },
      { target: 'Empty State', type: 'Fixed', note: '빈 상태 지침의 Button size를 Button 자신의 규칙(단독 동작은 lg)에 맞추고, 아이콘에 aria-hidden을 달았어요.' },
    ],
    requests: [
      { label: '화면의 구획을 나누고 로딩·빈 상태를 보여줄 부품을 만들어주세요', done: true },
      { label: 'Skeleton과 Progress의 트랙이 카드나 스테이지 위에서도 보이게 해주세요', done: true },
      { label: '폼이나 절차의 단계를 보여주는 컴포넌트를 만들어주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
    ],
    impact: ['Components', 'Foundations'],
  },
  {
    version: 'v0.8.0',
    publishedAt: '2026-08-26',
    title: '열네 개를 더해 다섯 카테고리를 모두 채웠어요',
    purpose:
      'v0.7.0까지 등록된 컴포넌트는 Button·Input·Select·Checkbox 넷뿐이라 다섯 카테고리 중 actions와 inputs만 일부 찼어요. 열넷을 더해 navigation·feedback·data-display까지 다섯 카테고리를 모두 세웠고, 옅게 탄 배경 위에 얹힌 상태 글자의 대비가 여러 곳에서 동시에 부족했던 것을 토큰 층에서 고쳤어요.',
    changes: [
      { target: '컴포넌트 열넷', type: 'New', note: 'Textarea·Badge·Alert·Breadcrumb·Pagination·Radio·Switch·Tabs·Tooltip·Dialog·Dropdown Menu·Avatar·Toast·Table을 더해 다섯 카테고리를 모두 채웠어요.' },
      { target: '탄 배경 위 상태 글자', type: 'Fixed', note: '옅게 탄 배경(/10·/15) 위에 얹힌 상태 글자색의 대비가 4.5:1에 못 미치던 곳을 토큰 층에서 맞췄어요. 문서 장식의 칩도 같은 기준으로 고쳤어요.' },
      { target: 'Alert', type: 'Fixed', note: 'role="alert"를 하드코딩 대신 live prop으로 받게 했어요.' },
      { target: 'Table / Dialog', type: 'Fixed', note: '표의 가로 스크롤 그릇과 Dialog의 긴 본문이 키보드로도 닿게 했어요.' },
      { target: 'Dialog', type: 'Fixed', note: '컴포넌트에 없는 size 축을 Properties에서 뺐어요.' },
      { target: 'State 축', type: 'Fixed', note: '컴포넌트마다 다르던 상태 축 순서를 하나로 맞추고, State 문서에 남아 있던 낡은 목록을 없앴어요.' },
      { target: 'Input / Select / Checkbox', type: 'Fixed', note: 'Select의 defaultOpen이 강제로 열려 있던 문제와 세 컴포넌트에 hover 상태가 없던 문제를 고쳤어요.' },
    ],
    requests: [
      { label: '나머지 다섯 카테고리를 마저 채워주세요', done: true },
      { label: '옅게 탄 배경 위 글자가 흐리게 보이는 문제를 고쳐주세요', done: true },
      { label: 'Alert가 스크린리더에게 실제로 알림으로 읽히게 해주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '접근성 후속 묶음(포커스 링 대비, 이름 없는 라벨, Toast의 assertive 알림)을 언제 다룰 것인가', category: 'Components', completed: false },
    ],
    impact: ['Components', 'Foundations'],
  },
  {
    version: 'v0.7.0',
    publishedAt: '2026-08-25',
    title: '폼 입력 세 가지로 첫 공통 계약을 세웠어요',
    purpose:
      '등록된 컴포넌트가 Button 하나뿐이라 확인할 것이 거의 없었어요. Input·Select·Checkbox를 한 묶음으로 더해 셋이 상태와 토큰을 공유하는 첫 공통 계약 — 컨트롤 높이, 포커스 링, 오류 표현 — 을 세웠어요. 문서에만 있고 실제로는 아무도 쓰지 않던 --color-input과 --color-ring 토큰도 이번에 처음 검증됐어요.',
    changes: [
      { target: 'Input', type: 'New', note: '한 줄짜리 값을 입력받아요. 컨트롤 높이를 h-control 토큰에 처음 연결했어요.' },
      { target: 'Select', type: 'New', note: '여러 값 중 하나를 고르게 해요. @radix-ui/react-select를 써요.' },
      { target: 'Checkbox', type: 'New', note: '여러 값을 켜고 꺼요. @radix-ui/react-checkbox를 써요.' },
      { target: 'Input / Select / Checkbox', type: 'New', note: '셋이 공유하는 계약을 세웠어요 — 같은 size의 높이는 서로 같고, 포커스 링은 한 모양이고, 오류는 aria-invalid로 나타내고 색과 문구를 함께 써요.' },
      { target: 'Anatomy', type: 'Fixed', note: '구조도의 미리보기가 인스턴스 하나로만 그려지게 했어요.' },
    ],
    requests: [
      { label: '폼에서 쓸 기본 입력 컴포넌트를 만들어주세요', done: true },
      { label: '여러 값 중 하나를 고르는 컴포넌트를 만들어주세요', done: true },
      { label: '여러 값을 켜고 끄는 컴포넌트를 만들어주세요', done: true },
      { label: '세 컴포넌트의 높이와 포커스 링, 오류 표현을 통일해주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '라벨·도움말·오류를 묶는 Field 감싸개가 필요한가 — 세 컴포넌트가 자리 잡은 뒤에 판단한다', category: 'Components', completed: false },
    ],
    impact: ['Components', 'Foundations'],
  },
  {
    version: 'v0.6.0',
    publishedAt: '2026-08-25',
    title: '구조를 가리키는 이름을 다시 영문으로 돌렸어요',
    purpose:
      'v0.5.0에서 섹션 제목을 전부 한국어로 통일했는데, 결과를 본 사용자가 방향을 뒤집었어요. 구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리하고, 목차·간격·footer 같은 읽는 경험도 함께 다듬었어요.',
    changes: [
      { target: 'Writing / 섹션 제목', type: 'Updated', note: '구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리했어요. Writing 문서의 Language 절도 새 규칙으로 다시 썼어요.' },
      { target: 'Anatomy', type: 'Fixed', note: '지시선이 부위 가장자리에서 꺾이도록 고쳐 서로 겹치지 않게 했어요.' },
      { target: 'HeadingAnchor', type: 'New', note: '제목에 마우스를 올리면 그 절의 주소를 복사하는 아이콘이 나타나요.' },
      { target: 'AppShell / TableOfContents', type: 'Updated', note: '목차를 main 안에 sticky로 옮기고 스크롤바를 감췄고, 스크롤을 다루는 코드를 한 모듈로 모아 해시 안착과 문서 전환 위치를 고쳤어요.' },
      { target: 'DocPage / ComponentPage', type: 'Updated', note: '섹션 사이 간격을 넓히고, LNB 하위 항목의 모서리를 없앴어요.' },
      { target: 'Foundations / Components Overview', type: 'New', note: '카드 목록 위에 그 섹션이 무엇을 다루는지 설명하는 개요를 실었어요.' },
      { target: 'SiteFooter', type: 'New', note: '모든 페이지 최하단에 저작권·메뉴·연락처를 담은 footer를 추가했어요.' },
      { target: 'PropertyOption', type: 'Fixed', note: '값이 남지 않은 label 필드와 optionLabel 함수를 지웠어요.' },
    ],
    requests: [
      { label: '구조를 가리키는 이름은 영문으로, 설명은 한국어로 다시 정리해주세요', done: true },
      { label: 'Anatomy 지시선이 겹치지 않게 고쳐주세요', done: true },
      { label: '제목에서 그 절의 주소를 복사할 수 있게 해주세요', done: true },
      { label: '목차를 컨테이너 위에 sticky로 붙이고 스크롤바는 감춰주세요', done: true },
      { label: 'LNB 하위 항목의 모서리를 없애고 섹션 사이 간격을 넓혀주세요', done: true },
      { label: 'Overview 페이지에 그 섹션의 개요를 실어주세요', done: true },
      { label: '모든 페이지에 footer를 넣어주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '해시로 안착한 뒤 문서가 자라는 동안 사용자가 직접 스크롤하면 그 조작이 다시 덮어써지는가', category: 'Patterns', completed: false },
    ],
    impact: ['전체 화면', 'Foundations', 'Components', 'Patterns'],
  },
  {
    version: 'v0.5.0',
    publishedAt: '2026-08-25',
    title: '읽는 경험을 다듬었어요',
    purpose:
      '문서가 늘어나면서 드러난 문제들을 손봤어요. 섹션 제목을 한국어로 통일하고 제목 위계를 세우고, 목차를 붙이고, 지침의 do와 don\'t를 한데 묶고, Color의 하위 문서를 LNB에서 들여썼어요.',
    changes: [
      { target: 'Writing / 섹션 제목', type: 'Updated', note: '섹션 제목을 한국어로 통일하고, 이 규칙을 Writing 문서에 적었어요. 페이지 이름과 코드 식별자만 영어로 남겼어요.' },
      { target: 'DocPage / ComponentPage', type: 'Updated', note: '섹션 제목 크기를 본문보다 크게 키워 위계를 세웠어요.' },
      { target: 'TableOfContents', type: 'New', note: 'PC 화면 오른쪽에 문서 목차를 추가했어요. 스크롤하면 현재 위치가 따라 강조돼요.' },
      { target: 'GuidelineBlock', type: 'Updated', note: "지침의 do와 don't를 하나의 열로 묶고 같은 줄의 높이를 맞췄어요." },
      { target: 'Lnb / nav-config', type: 'Updated', note: 'Color Role과 Palette를 Color 아래로 들여썼어요.' },
      { target: 'PropertyBlock', type: 'Updated', note: '속성 표 헤더와 옵션 라벨 크기를 제목 위계에 맞췄어요.' },
    ],
    requests: [
      { label: '한 페이지 안에서 한글과 영어가 섞이지 않게 해주세요', done: true },
      { label: '섹션 제목이 본문보다 작아 보이는 문제를 고쳐주세요', done: true },
      { label: '긴 문서에서 지금 어디를 읽고 있는지 알려주세요', done: true },
      { label: "지침의 do와 don't가 따로 노는 것처럼 보이지 않게 해주세요", done: true },
      { label: 'Color Role과 Palette가 Color의 하위 문서라는 것을 목록에서도 보여주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: '섹션 제목을 전부 한국어로 통일한 방향이 실제 기대와 맞는가', category: 'Foundations', completed: false },
    ],
    impact: ['전체 화면', 'Foundations', 'Components'],
  },
  {
    version: 'v0.4.0',
    publishedAt: '2026-08-25',
    title: '토큰 문서를 완성했어요',
    purpose:
      'Anatomy 지시선과 예시 화면을 다듬고, Design Token·Color Role·Palette 문서를 새로 만들어 토큰 체계를 한 바퀴 완성한다.',
    changes: [
      { target: 'Anatomy', type: 'Updated', note: '지시선 색과 굵기를 다듬고 좁은 화면에서도 겹치지 않게 고쳤어요.' },
      { target: 'ComponentPage', type: 'Updated', note: 'Variant 표와 Size 표를 따로 나눴어요.' },
      { target: 'Playground', type: 'New', note: '조합을 기본값으로 되돌리는 리셋 버튼을 추가했어요.' },
      { target: '컴포넌트 예시', type: 'New', note: '실제 화면을 흉내 낸 예시를 15개 늘렸어요.' },
      { target: 'DocPage', type: 'New', note: '최종 수정일 표시와 섹션 안에서 바로 이동하는 기능을 더했어요.' },
      { target: 'Design Token / Color Role / Palette', type: 'New', note: '토큰 체계를 다루는 문서 3개를 새로 만들었어요.' },
      { target: 'CopyValue', type: 'New', note: '토큰 값을 클릭 한 번에 복사하는 기능을 더했어요.' },
      { target: 'Pretendard / Typography', type: 'Updated', note: '폰트 스택 설명과 타이포그래피 문서를 확장했어요.' },
    ],
    requests: [
      { label: '지시선 색과 굵기, 좁은 화면 대응을 개선해주세요', done: true },
      { label: 'Variant와 Size 표를 나눠주세요', done: true },
      { label: 'Playground에 리셋 버튼을 추가해주세요', done: true },
      { label: '컴포넌트 예시 화면을 더 다양하게 보여주세요', done: true },
      { label: '토큰이 언제 마지막으로 바뀌었는지, 섹션 안에서 바로 이동할 방법도 알려주세요', done: true },
      { label: 'Design Token과 Color Role, Palette 문서를 새로 만들어주세요', done: true },
      { label: '토큰 값을 클릭해서 복사할 수 있게 해주세요', done: true },
      { label: 'Pretendard와 Typography 문서를 더 자세히 다뤄주세요', done: true },
    ],
    reviewItems: [
      { label: 'useMeasuredTokens가 여러 Foundations 페이지에 중복되는 것을 걷어낼 수 있는가', category: 'Foundations', completed: false },
      { label: "PropertyBlock의 property.name === 'state' 하드코딩을 데이터 쪽으로 옮길 수 있는가", category: 'Components', completed: false },
      { label: 'Anatomy의 배지 좌표를 매번 다시 계산하지 않고 기억해 둘 수 있는가', category: 'Components', completed: false },
      { label: 'nav-config의 updatedAt을 문서별로 자동 갱신하는 구조가 필요한가', category: 'Patterns', completed: false },
    ],
    impact: ['Foundations', 'Components', 'Anatomy', 'Typography'],
  },
  {
    version: 'v0.3.0',
    publishedAt: '2026-08-25',
    title: 'GNB와 LNB로 문서 골격을 세웠어요',
    purpose:
      'GNB+LNB 2단 내비게이션과 property 축 구조로 문서 골격을 세우고, Foundations를 8개로 채운다.',
    changes: [
      { target: 'GNB / LNB', type: 'New', note: '섹션은 GNB, 문서 목록은 LNB로 나눈 2단 내비게이션을 만들었어요.' },
      { target: 'Foundations', type: 'New', note: '문서 8개를 채웠어요.' },
      { target: 'ComponentProperty', type: 'New', note: 'variant·size 같은 축을 컴포넌트 메타에서 선언하는 구조를 세웠어요.' },
      { target: 'Anatomy', type: 'New', note: '부위를 가리키는 지시선과 클릭하면 강조되는 상호작용을 더했어요.' },
      { target: 'ComponentPage', type: 'New', note: 'Playground·Usage·Cases 섹션을 붙였어요.' },
    ],
    requests: [
      { label: '섹션과 문서 목록을 나눠서 보여주세요', done: true },
      { label: 'Foundations 문서를 더 채워주세요', done: true },
      { label: 'variant·size 같은 축을 컴포넌트마다 정리해주세요', done: true },
      { label: 'anatomy에 부위를 가리키는 지시선을 그려주세요', done: true },
      { label: 'Playground에서 조합을 바로 확인하게 해주세요', done: true },
    ],
    reviewItems: [
      { label: '지시선이 다크 모드에서 색이 흐려 보이는가', category: 'Components', completed: true },
      { label: '좁은 화면에서 지시선끼리 겹치는가', category: 'Components', completed: true },
      { label: 'Variant와 Size 표가 한 표에 섞여 읽기 어려운가', category: 'Components', completed: true },
    ],
    impact: ['전체 화면', 'Foundations', 'Components'],
  },
  {
    version: 'v0.2.0',
    publishedAt: '2026-08-25',
    title: '토큰과 컴포넌트 배관을 연결했어요',
    purpose: 'Tailwind v4 + shadcn 기반으로 재작성하고, 메타데이터에서 전시 화면이 생성되는 구조를 세운다.',
    changes: [
      { target: 'Tokens', type: 'New', note: '색·radius·shadow·density·z-index를 한 곳에 모았어요.' },
      { target: 'AppShell', type: 'New', note: '사이드바 항목이 실제로 이동합니다.' },
      { target: 'Button', type: 'New', note: 'shadcn Button과 전시 페이지를 붙였어요.' },
      { target: 'Registry', type: 'New', note: '컴포넌트 메타에서 전시 화면이 자동 생성됩니다.' },
    ],
    requests: [
      { label: '컴포넌트 anatomy 표시', done: true },
      { label: '반응형 고려', done: true },
      { label: '새 버전 업데이트 알림', done: false },
    ],
    reviewItems: [
      { label: '다크 모드에서 surface-raised 대비가 충분한가', category: 'Foundations', completed: false },
      { label: '720px에서 전시 그리드가 깨지지 않는가', category: 'Patterns', completed: false },
    ],
    impact: ['전체 화면', 'Button', 'Foundations'],
  },
  {
    version: 'v0.1.0',
    publishedAt: '2026-08-24',
    title: '첫 번째 기준선이 준비됐어요',
    purpose: '어드민 워크벤치의 첫 화면을 만들어 방향을 확인한다.',
    changes: [
      { target: 'Overview', type: 'New', note: '디자인 시스템 현황 화면을 만들었어요.' },
    ],
    requests: [],
    reviewItems: [],
    impact: ['Overview'],
  },
]

export const currentRelease: Release = releases[0]

export function requestProgress(release: Release) {
  return {
    done: release.requests.filter((r) => r.done).length,
    total: release.requests.length,
  }
}
