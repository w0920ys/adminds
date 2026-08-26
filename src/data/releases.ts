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
      { target: 'Docs', type: 'Updated', note: '문서 화면의 줄 간격과 여백을 다시 잡았어요. 읽는 글이 놓이는 세 크기(text-xs·sm·base)의 줄 간격을 16/20/24px에서 20/24/28px로 올렸어요 — 셋 다 4의 배수라 여백 격자에도 컨트롤 높이에도 어긋나지 않아요. 본문 한 줄은 856px까지 늘어나던 것을 672px에서 끊었고(무대·표·놀이터는 그대로 전폭을 써요), 절 사이 120px은 64/80px로 좁히는 대신 절 안의 간격을 올려 빽빽한 덩어리 사이에 협곡만 남던 리듬을 되돌렸어요. 좁은 화면에서는 본문이 15px/26.25px로 한 단계 커지고 바깥 여백도 함께 넓어져요. 문서 안에서 문장 노릇을 하던 12px 문단 스물여섯 곳도 본문 크기로 올렸어요. 컨트롤 높이(32·36·40px)와 표 행 높이(48·40px), Badge(20px)는 재 보니 모두 그대로예요 — 탭 트리거만 padding과 줄 간격이 우연히 만들던 32px이라 h-control-sm으로 못 박아 밀도 축에 붙였어요.' },
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
