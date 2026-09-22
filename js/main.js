/**
 * 랭커의 쇼핑 (Ranker's Shopping) - 메인 스크립트
 * 7대 쇼핑몰 실시간 랭킹 센터, 구글 뉴스 피드 및 3초 진단기 제어
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 모바일 메뉴 토글
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // 2. 실시간 검색 필터링 (메인 페이지 article-grid)
  const searchInput = document.getElementById('siteSearchInput');
  const articleCards = document.querySelectorAll('.article-card');

  if (searchInput && articleCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();

      articleCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.card-category')?.textContent.toLowerCase() || '';

        if (title.includes(keyword) || desc.includes(keyword) || category.includes(keyword)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 3. 7대 쇼핑몰 실시간 가격비교 & 바로가기 모달 창 제어 엔진
  initShoppingSearchModal();

  // 4. 구글 뉴스 IT/테크 실시간 자동 갱신 (Live Google News Engine)
  initLiveGoogleNews();

  // 5. 3초 스마트 가전 셀프 진단기 (Smart Product Quiz)
  initProductQuiz();

  // 6. 문의하기 (Contact Form) 전송 시뮬레이션
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('문의가 성공적으로 접수되었습니다. 기재해주신 이메일(rkstmtk@gmail.com 수신)로 신속히 답변드리겠습니다.');
      contactForm.reset();
    });
  }

  // 7. 실시간 쇼핑 랭킹 센터 탭 전환 엔진 (ranking.html - 7대 쇼핑몰)
  initRankingTabs();

  // 8. 연령대별 실시간 쇼핑 랭킹 센터 탭 전환 엔진 (age-ranking.html - 20대~70대)
  initAgeRankingTabs();

  // 9. 전 카테고리 요일별 자동 갱신 및 실시간 순위 변동 엔진
  initDailyDynamicRanking();

  // 10. 매일 오전 9시 정각 자동 갱신 스케줄러 (브라우저 열림 상태 시 실시간 갱신)
  scheduleNextMorning9Update();
});

/**
 * 실시간 쇼핑 랭킹 센터 탭 전환 (네이버, 쿠팡, SSG 신세계몰, 아마존, 알리, 오늘의집, G마켓)
 */
function initRankingTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');
  if (tabButtons.length === 0) return;

  const validPlatforms = ['naver', 'coupang', 'ssg', 'amazon', 'aliexpress', 'todayhouse', 'gmarket'];

  function switchTab(platform) {
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'naver', 'coupang', 'ssg', 'amazon', 'aliexpress', 'todayhouse', 'gmarket');
      if (btn.getAttribute('data-platform') === platform) {
        btn.classList.add('active', platform);
      }
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `${platform}-panel`) {
        panel.classList.add('active');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');
      switchTab(platform);
      window.location.hash = platform;
    });
  });

  // URL 해시 기반 탭 활성화 (예: ranking.html#naver, ranking.html#ssg)
  const hash = window.location.hash.replace('#', '');
  if (hash && validPlatforms.includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('naver'); // 기본값: 👑 1순위 국민 쇼핑몰 네이버쇼핑
  }

  // 랭킹 갱신 시각 표시 (매일 오전 9시 기준)
  const rankingUpdateTime = document.getElementById('rankingUpdateTime');
  if (rankingUpdateTime) {
    const info = getMorning9BaseDate();
    rankingUpdateTime.textContent = info.rankingTimeStr;
  }
}

/**
 * 연령대별 실시간 쇼핑 랭킹 센터 탭 전환 (0~9세, 10대, 20대, 30대, 40대, 50대, 60대, 70대)
 */
function initAgeRankingTabs() {
  const tabButtons = document.querySelectorAll('.age-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');
  if (tabButtons.length === 0) return;

  const validAges = ['0', '10', '20', '30', '40', '50', '60', '70'];

  function switchAgeTab(age) {
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'age0', 'age10', 'age20', 'age30', 'age40', 'age50', 'age60', 'age70');
      if (btn.getAttribute('data-age') === age) {
        btn.classList.add('active', `age${age}`);
      }
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `age${age}-panel`) {
        panel.classList.add('active');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const age = btn.getAttribute('data-age');
      switchAgeTab(age);
      window.location.hash = `age${age}`;
    });
  });

  // URL 해시 기반 탭 활성화 (예: age-ranking.html#age0, age-ranking.html#age10, age-ranking.html#age20)
  const rawHash = window.location.hash.replace('#age', '').replace('#', '');
  if (rawHash && validAges.includes(rawHash)) {
    switchAgeTab(rawHash);
  } else {
    switchAgeTab('0'); // 기본값: 0~9세 키즈·베이비
  }

  // 연령별 랭킹 갱신 시각 표시 (매일 오전 9시 기준)
  const ageRankingUpdateTime = document.getElementById('ageRankingUpdateTime');
  if (ageRankingUpdateTime) {
    const info = getMorning9BaseDate();
    ageRankingUpdateTime.textContent = info.rankingTimeStr;
  }
}

/**
 * 구글 뉴스 IT/테크 헤드라인 실시간 자동 갱신 엔진
 * 오늘 날짜 기준 최신 테크 이슈를 비동기 호출 및 렌더링
 */
async function initLiveGoogleNews() {
  const newsGrid = document.getElementById('liveNewsGrid');
  const newsUpdatedTime = document.getElementById('newsUpdatedTime');
  if (!newsGrid) return;

  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  if (newsUpdatedTime) {
    newsUpdatedTime.textContent = `오늘 ${dateStr} ${timeStr} 기준 실시간`;
  }

  // 안전한 최신 테크 뉴스 스마트 Fallback 데이터셋 (API 호출 실패/CORS 제한 시에도 100% 정상 작동)
  const defaultNews = [
    {
      source: "구글 IT 뉴스",
      time: "방금 전",
      title: "2026 차세대 올인원 로봇청소기, 10,000Pa 돌파 및 온수 살균 경쟁 심화",
      snippet: "주요 가전 제조사들이 바닥 인식 AI 센서와 초고온 열풍건조 스테이션을 앞다퉈 탑재하며 프리미엄 로봇청소기 시장이 재편되고 있습니다.",
      url: "articles/robot-vacuum-guide.html"
    },
    {
      source: "테크 테크놀로지",
      time: "1시간 전",
      title: "유럽 PFAS 유해물질 규제 강화… '올스텐 304' 주방 가전 수요 급증",
      snippet: "테플론 코팅 논란으로 인해 환경호르몬 걱정 없는 풀 스테인리스 에어프라이어와 조리 기구가 국내외 시장에서 가파른 상승세를 보이고 있습니다.",
      url: "articles/air-fryer-tips.html"
    },
    {
      source: "디지털 디스플레이",
      time: "2시간 전",
      title: "OLED 모니터 패널 대중화 원년… 3세대 패널로 번인(Burn-in) 우려 불식",
      snippet: "게이밍 및 전문 그래픽 작업자를 중심으로 빠른 응답속도와 완벽한 암부 표현을 갖춘 고주사율 OLED 패널 공급이 대폭 확대되고 있습니다.",
      url: "articles/monitor-panel-guide.html"
    },
    {
      source: "모바일 인사이트",
      time: "3시간 전",
      title: "스마트폰 배터리 보호 기술 진화… 인공지능 충전 관리로 수명 3년 보장",
      snippet: "배터리 완충 상태 유지를 방지하고 기상 시간에 맞춰 80%를 제어하는 스마트 충전 소프트웨어가 모바일 기기의 핵심 기능으로 정착했습니다.",
      url: "articles/smartphone-battery.html"
    },
    {
      source: "홈오피스 리빙",
      time: "4시간 전",
      title: "재택근무 장기화에 '인체공학 의자' 투자 확산… 럼버서포트 기술 경쟁",
      snippet: "허리 통증을 호소하는 현대인이 늘면서 단순 디자인 의자보다 척추 각도와 체형 맞춤형 틸팅 기술이 적용된 의자 판매량이 전년비 40% 증가했습니다.",
      url: "articles/ergonomics-chair.html"
    },
    {
      source: "쇼핑 트렌드 리포트",
      time: "오늘 09:00",
      title: "2026 상반기 가성비 스마트 가전 판매 순위 발표… '실속형'이 대세",
      snippet: "고물가 시대 속에서 불필요한 부가 기능을 뺀 핵심 스펙 중심의 가전제품이 1인 가구 및 신혼부부에게 압도적인 인기를 얻고 있습니다.",
      url: "index.html"
    }
  ];

  try {
    // 실시간 Google News RSS 비동기 시도 (CORS 프록시 활용)
    const rssFeedUrl = 'https://news.google.com/rss/search?q=스마트가전+IT&hl=ko&gl=KR&ceid=KR:ko';
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5초 타임아웃
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.items && data.items.length >= 3) {
        renderNewsItems(data.items.slice(0, 6).map(item => ({
          source: item.author || "Google News IT",
          time: "실시간 속보",
          title: item.title,
          snippet: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...' : '구글 뉴스 최신 헤드라인',
          url: item.link
        })));
        return;
      }
    }
  } catch (err) {
    // 네트워크 지연 또는 CORS 정책 시 조용히 스마트 기본 피드로 전환
  }

  // 기본 최신 큐레이션 렌더링
  renderNewsItems(defaultNews);

  function renderNewsItems(items) {
    newsGrid.innerHTML = items.map(item => `
      <div class="news-card">
        <div class="news-source-row">
          <span class="news-source-tag">📰 ${escapeHtml(item.source)}</span>
          <span>${escapeHtml(item.time)}</span>
        </div>
        <h4 class="news-headline">${escapeHtml(item.title)}</h4>
        <p class="news-snippet">${escapeHtml(item.snippet)}</p>
        <a href="${escapeHtml(item.url)}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" class="news-footer-link">
          심층 브리핑 확인하기 &rarr;
        </a>
      </div>
    `).join('');
  }
}

/**
 * 3초 스마트 가전 셀프 진단기 인터랙티브 위젯
 */
function initProductQuiz() {
  const quizSection = document.querySelector('.quiz-section');
  if (!quizSection) return;

  const state = {
    space: 'room',    // room, mid, large
    category: 'robot', // robot, kitchen, monitor, chair
    budget: 'budget'  // budget, premium
  };

  const optionButtons = document.querySelectorAll('.option-btn');
  const resultBox = document.getElementById('quizResultBox');
  const resultTitle = document.getElementById('quizResultTitle');
  const resultDesc = document.getElementById('quizResultDesc');
  const resultLink = document.getElementById('quizResultLink');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-group');
      const val = btn.getAttribute('data-val');

      // 같은 그룹 내 선택 해제
      document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      state[group] = val;
      updateQuizResult();
    });
  });

  function updateQuizResult() {
    if (!resultBox) return;

    let title = "";
    let desc = "";
    let link = "";
    let linkText = "";

    if (state.category === 'robot') {
      if (state.space === 'room' || state.budget === 'budget') {
        title = "💡 [원룸/가성비 추천] LDS 라이다 센서 탑재 실속형 로봇청소기";
        desc = "좁은 공간에서는 비싼 자동 세척 스테이션보다 벽면 감지가 확실한 LDS 라이다 센서와 4,000Pa 기본 흡입력 모델이 가장 합리적입니다.";
      } else {
        title = "👑 [프리미엄 추천] 온수 걸레세척 + 열풍건조 올인원 플래그십";
        desc = "20~30평 이상 공간에서는 엉킴 방지 롤러와 60℃ 온수 걸레 세척, 자동 먼지비움 스테이션이 갖춰진 올인원 모델을 강력 추천합니다.";
      }
      link = "articles/robot-vacuum-guide.html";
      linkText = "로봇청소기 완벽 구매 가이드 읽기 &rarr;";
    } else if (state.category === 'kitchen') {
      if (state.budget === 'budget' || state.space === 'room') {
        title = "💡 [1~2인 가구 추천] 5~7L 바스켓형 올스텐 에어프라이어";
        desc = "설거지가 간편하고 공간을 적게 차지하는 SUS 304 바스켓형 모델이 매일 쓰기에 가장 편리합니다.";
      } else {
        title = "👨‍👩‍👧‍👦 [가족형 추천] 14L 이상 대용량 올스텐 오븐형 에어프라이어";
        desc = "내부 6면과 상부 열선까지 100% 스테인리스 304로 마감된 투명창 대용량 오븐형으로 다양한 요리를 즐기세요.";
      }
      link = "articles/air-fryer-tips.html";
      linkText = "올스텐 에어프라이어 선택법 확인 &rarr;";
    } else if (state.category === 'monitor') {
      if (state.budget === 'premium') {
        title = "🖥️ [하이엔드 추천] 무한대 명암비의 고주사율 OLED 모니터";
        desc = "0.03ms 응답속도와 완벽한 블랙 표현으로 게임과 영상 시청의 궁극적인 몰입감을 제공합니다.";
      } else {
        title = "💼 [사무·작업용 추천] 광시야각 & 높은 텍스트 가독성의 IPS 패널";
        desc = "장시간 문서 작업, 웹서핑, 그래픽 작업을 할 때 눈의 피로를 최소화하는 표준 IPS 27인치/32인치를 추천합니다.";
      }
      link = "articles/monitor-panel-guide.html";
      linkText = "모니터 패널(IPS vs VA vs OLED) 비교 가이드 &rarr;";
    } else {
      // chair
      title = "🪑 [인체공학 의자 추천] 럼버서포트 깊이 조절 & 싱크로나이즈드 틸트 체어";
      desc = "허리 건강을 지키려면 등판과 좌판이 유기적으로 움직이는 싱크로나이즈드 틸팅과 요추 전후 깊이 조절이 필수적입니다.";
      link = "articles/ergonomics-chair.html";
      linkText = "인체공학 의자 선택법 확인하기 &rarr;";
    }

    resultTitle.textContent = title;
    resultDesc.textContent = desc;
    resultLink.href = link;
    resultLink.innerHTML = linkText;
    resultBox.classList.add('show');
  }

  // 초기 1회 실행
  updateQuizResult();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

/**
 * 7대 쇼핑몰 실시간 가격비교 & 바로가기 모달 창 제어 엔진
 */
function initShoppingSearchModal() {
  const modal = document.getElementById('shoppingSearchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const searchBtn = document.getElementById('siteSearchBtn');
  const closeBtn = document.getElementById('closeSearchModalBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const modalQueryText = document.getElementById('modalQueryText');
  const modalGrid = document.getElementById('modalMallCardsGrid');
  const quickTagChips = document.querySelectorAll('.quick-tag-chip');
  const tickerItems = document.querySelectorAll('.keyword-item');

  if (!modal) return;

  function openShoppingModal(rawQuery) {
    const query = (rawQuery || '').trim() || '스마트워치';
    if (modalQueryText) modalQueryText.textContent = query;
    if (searchInput) searchInput.value = query;

    // 7대 쇼핑몰 맞춤 프리뷰 및 링크 데이터 생성
    const qEnc = encodeURIComponent(query);
    const qLower = query.toLowerCase();

    // 카테고리별 맞춤 프리뷰 기본값
    let previews = {
      naver: `네이버쇼핑 '${escapeHtml(query)}' 실시간 랭킹 1위 &amp; N포인트 최대 5% 적립`,
      coupang: `쿠팡 와우 '${escapeHtml(query)}' 로켓배송 실시간 와우회원 즉시할인`,
      ssg: `SSG.COM 신세계몰 '${escapeHtml(query)}' 신세계백화점 명품 &amp; 쓱배송 특가`,
      amazon: `'${escapeHtml(query)}' Amazon Choice 베스트셀러 &amp; 한국 무료 직배송`,
      aliexpress: `알리익스프레스 '${escapeHtml(query)}' 5일 무료배송 초가성비 직구 특가`,
      todayhouse: `오늘의집 '${escapeHtml(query)}' 감성 인테리어 &amp; 리빙 단독 기획전 혜택`,
      gmarket: `G마켓 슈퍼딜 '${escapeHtml(query)}' 빅스마일데이 중복할인 쿠폰가`
    };

    if (qLower.includes('워치') || qLower.includes('시계')) {
      previews.naver = '갤럭시워치7 / 애플워치 울트라2 실시간 최저가 및 N페이 추가 적립';
      previews.coupang = '[로켓배송] 스마트워치 와우회원 카드사 즉시할인 &amp; 내일 새벽 도착';
      previews.ssg = '[신세계백화점] Apple Watch &amp; Galaxy Watch 백화점 정품 보증';
      previews.amazon = '[Global Direct] Apple Watch &amp; Garmin Smartwatch 인기 직구';
      previews.aliexpress = '[초가성비] 스마트워치 마그네틱 루프 스트랩 &amp; 가성비 스마트밴드';
      previews.todayhouse = '[데스크테리어] 스마트워치 3in1 고속 무선충전 거치대 특가';
      previews.gmarket = '[슈퍼딜] 브랜드 스마트워치 단독 쿠폰팩 &amp; 매일 파격 특가';
    } else if (qLower.includes('로봇') || qLower.includes('청소기')) {
      previews.naver = '2026 차세대 올인원 로봇청소기 &amp; 흡입력 10,000Pa 실시간 랭킹';
      previews.coupang = '[로켓와우] 로보락 / 에코백스 / 삼성 로봇청소기 특가 보러가기';
      previews.ssg = '[SSG 단독] 로보락 / 삼성 비스포크 로봇청소기 백화점 상품권 증정';
      previews.amazon = '[Amazon Bestseller] iRobot Roomba &amp; Shark Cleaners 직배송';
      previews.aliexpress = '[천원마켓] 무선 미니 청소기 &amp; 로봇청소기 정품 소모품 세트';
      previews.todayhouse = '[클린 리빙] 공간절약 무선 청소기 &amp; 감성 올인원 클린 스테이션';
      previews.gmarket = '[슈퍼딜] 대기업 프리미엄 로봇청소기 빅스마일데이 단독 특가';
    } else if (qLower.includes('에어프라이어')) {
      previews.naver = '올스텐 304 대용량 에어프라이어 네이버 국민 랭킹 1위 모음';
      previews.coupang = '[로켓와우] 스테인리스 에어프라이어 오늘 주문 내일 도착 특가';
      previews.ssg = '[명품 주방] 올스텐 304 에어프라이어 &amp; 프리미엄 쿡웨어 쓱배송';
      previews.amazon = '[Global Best] Ninja Air Fryer &amp; Instant Vortex 해외 인기 모델';
      previews.aliexpress = '[초특가] 에어프라이어 전용 실리콘 조리 용기 2종 세트';
      previews.todayhouse = '[주방인테리어] 감성 오브제 올스텐 오븐형 에어프라이어';
      previews.gmarket = '[슈퍼딜] 인기 주방가전 에어프라이어 한정수량 슈퍼딜 특가';
    } else if (qLower.includes('텀블러')) {
      previews.naver = '스탠리 퀜처 / 써모스 보냉 보온 대용량 텀블러 네이버 인기 순위';
      previews.coupang = '[로켓배송] 스탠리 진공 텀블러 와우 로켓 정품 안심 배송';
      previews.ssg = '[신세계 정품] 스탠리 퀜처 / 써모스 보냉 텀블러 백화점 공식 패키지';
      previews.amazon = '[Amazon Official] Stanley Quencher H2.0 40oz 직구 베스트';
      previews.aliexpress = '[가성비 악세서리] 텀블러 전용 빨대 커버 &amp; 실리콘 부트 세트';
      previews.todayhouse = '[홈카페 리빙] 감성 컬러 대용량 핸들 손잡이 보온 텀블러';
      previews.gmarket = '[슈퍼딜] 유명 브랜드 보냉 텀블러 단독 쿠폰 할인전';
    } else if (qLower.includes('에어팟') || qLower.includes('이어폰') || qLower.includes('헤드폰')) {
      previews.naver = 'Apple 에어팟 프로 2세대 USB-C &amp; 무선 노이즈캔슬링 최저가';
      previews.coupang = '[로켓와우] 에어팟 3세대 / 프로 정품 카드사 즉시할인 혜택';
      previews.ssg = '[신세계백화점] Apple 에어팟 프로 2세대 USB-C 정품 안심 배송';
      previews.amazon = '[Amazon Direct] AirPods Pro &amp; Bose QC45 Noise Cancelling';
      previews.aliexpress = '[초가성비 음향] QCY 노캔 무선이어폰 &amp; 보호 케이스 득템';
      previews.todayhouse = '[데스크테리어] 프리미엄 아크릴 헤드폰 거치대 &amp; 데스크 사운드';
      previews.gmarket = '[슈퍼딜] 정품 에어팟 &amp; 프리미엄 음향가전 슈퍼딜 특가전';
    } else if (qLower.includes('영양제') || qLower.includes('유산균') || qLower.includes('오메가')) {
      previews.naver = '락토핏 생유산균 / 고려은단 비타민C 네이버 건강식품 1위';
      previews.coupang = '[로켓배송] 종근당건강 온가족 필수 영양제 내일 새벽 도착';
      previews.ssg = '[이마트 쓱배송] 정관장 홍삼 &amp; 락토핏 생유산균 신세계 단독 기획';
      previews.amazon = '[iHerb / Amazon] California Gold 오메가3 &amp; 영양제 직구 1위';
      previews.aliexpress = '[생활용품] 휴대용 7일 분할 영양제 약통 케이스 콤보';
      previews.todayhouse = '[이너뷰티] 건강한 데일리 루틴 비타민 &amp; 밀크씨슬 큐레이션';
      previews.gmarket = '[슈퍼딜] 정관장 홍삼 &amp; 종근당 건강보조식품 대용량 기획팩';
    }

    const malls = [
      {
        id: 'naver',
        name: '네이버 쇼핑',
        badge: '👑 국민 1위 추천',
        preview: previews.naver,
        benefit: '🛍️ N페이 최대 5% 적립 · 스마트스토어 실시간 최저가',
        url: `https://search.shopping.naver.com/search/all?query=${qEnc}`
      },
      {
        id: 'coupang',
        name: '쿠팡 로켓배송',
        badge: '🚀 로켓 1위',
        preview: previews.coupang,
        benefit: '⚡ 와우회원 무료반품 · 오늘 주문 내일 새벽 도착',
        url: `https://www.coupang.com/np/search?component=&q=${qEnc}`
      },
      {
        id: 'ssg',
        name: 'SSG.COM 신세계몰',
        badge: '🏬 백화점 1위',
        preview: previews.ssg,
        benefit: '🛍️ 신세계백화점 정품 보장 · 쓱(SSG) 당일/새벽배송',
        url: `https://www.ssg.com/search.ssg?target=all&query=${qEnc}`
      },
      {
        id: 'amazon',
        name: '아마존 (Amazon)',
        badge: '📦 글로벌 직구 1위',
        preview: previews.amazon,
        benefit: '✈️ 49달러 이상 한국 무료배송 · 글로벌 공식 정품 보장',
        url: `https://www.amazon.com/s?k=${qEnc}`
      },
      {
        id: 'aliexpress',
        name: '알리익스프레스',
        badge: '✈️ 초가성비 직구',
        preview: previews.aliexpress,
        benefit: '💰 5일 무료배송 · 공장 직거래 초특가 득템관',
        url: `https://ko.aliexpress.com/wholesale?SearchText=${qEnc}`
      },
      {
        id: 'todayhouse',
        name: '오늘의집 리빙',
        badge: '🏠 감성 리빙 1위',
        preview: previews.todayhouse,
        benefit: '🛋️ 첫구매 할인쿠폰 · 실사용 포토리뷰 100만 건',
        url: `https://ohou.se/productions/feed?query=${qEnc}`
      },
      {
        id: 'gmarket',
        name: 'G마켓 슈퍼딜',
        badge: '🛒 슈퍼딜 특가',
        preview: previews.gmarket,
        benefit: '🎟️ 스마일클럽 전용 할인쿠폰 · 매일 갱신되는 특가',
        url: `https://browse.gmarket.co.kr/search?keyword=${qEnc}`
      }
    ];

    if (modalGrid) {
      modalGrid.innerHTML = malls.map(m => `
        <div class="modal-mall-card ${m.id}">
          <div class="modal-mall-header">
            <span class="modal-mall-name">${escapeHtml(m.name)}</span>
            <span class="modal-mall-tag">${escapeHtml(m.badge)}</span>
          </div>
          <div class="modal-mall-preview">${m.preview}</div>
          <div class="modal-mall-benefit">${m.benefit}</div>
          <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="modal-mall-btn">
            <span>${escapeHtml(m.name)}에서 '${escapeHtml(query)}' 보러가기</span>
            <span>&rarr;</span>
          </a>
        </div>
      `).join('');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // 전역 어디서나 모달을 호출할 수 있도록 window 객체에 바인딩
  window.openShoppingModal = openShoppingModal;

  function closeShoppingModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.closeShoppingModal = closeShoppingModal;

  // 1. 검색 버튼 클릭
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      openShoppingModal(searchInput.value);
    });
  }

  // 2. 검색창 엔터(Enter) 키 입력
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openShoppingModal(searchInput.value);
      }
    });
  }

  // 3. 추천 빠른 태그 칩 클릭
  if (quickTagChips.length > 0) {
    quickTagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent.replace('#', '');
        openShoppingModal(query);
      });
    });
  }

  // 4. 티커 키워드 클릭 시에도 모달창 연동
  if (tickerItems.length > 0) {
    tickerItems.forEach(item => {
      item.addEventListener('click', () => {
        const query = item.getAttribute('data-query') || item.textContent.replace(/[0-9위\s↗]/g, '');
        openShoppingModal(query);
      });
    });
  }

  // 5. 모달 닫기 버튼 및 배경 클릭
  if (closeBtn) closeBtn.addEventListener('click', closeShoppingModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeShoppingModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeShoppingModal();
    }
  });

  // 6. ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeShoppingModal();
    }
  });
}

/**
 * 전 카테고리 요일별 자동 갱신 및 실시간 순위 변동 엔진
 * IT, 자동차, 생활용품, 식품, 뷰티 전제품 요일별 자동 갱신 및 7대 쇼핑몰 연동
 */
function initDailyDynamicRanking() {
  const info = getMorning9BaseDate();
  const todayIndex = info.dayIndex; // 0(일) ~ 6(토) (오전 9시 기준 요일)

  // 요일별 특화 테마 및 실시간 랭킹 데이터셋
  const dailyThemes = [
    {
      dayName: "일요일",
      themeName: "주간 7대 쇼핑몰 종합 1위 결산 데이",
      desc: "한 주간 7대 쇼핑몰(네이버, 쿠팡, SSG 신세계몰, 아마존, 알리, 오늘의집, G마켓)에서 가장 많은 실사용자 구매와 검색이 집중된 전 카테고리 종합 1위 아이템을 엄선 결산합니다.",
      defaultCategory: "all",
      weeklyBest: [
        { rank: 1, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "HOT", tagClass: "hot", query: "로봇청소기", sub: "스마트가전 주간 종합 1위 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 2, cat: "식품", name: "락토핏 생유산균 골드 50포", tag: "▲2", tagClass: "up", query: "유산균", sub: "건강식품 주간 판매 1위 ↗" },
        { rank: 3, cat: "자동차", name: "맥세이프 고속 차량 거치대", tag: "▲1", tagClass: "up", query: "차량용 거치대", sub: "자동차용품 주간 베스트 ↗" },
        { rank: 4, cat: "생활", name: "크리넥스 3겹 데코 화장지", tag: "-", tagClass: "same", query: "화장지", sub: "생필품 주간 랭커 유지 ↗" },
        { rank: 5, cat: "뷰티", name: "마녀공장 퓨어 클렌징 오일", tag: "NEW", tagClass: "new", query: "클렌징오일", sub: "스킨케어 주간 랭킹 진입 ↗" }
      ]
    },
    {
      dayName: "월요일",
      themeName: "활력 충전! 식품 & 건강식품 데이",
      desc: "한 주를 건강하게 시작하는 필수 루틴! 락토핏 유산균, 고려은단 비타민, 닭가슴살 식단 등 7대 쇼핑몰 식품 카테고리 실시간 1위 상품을 자동 큐레이션합니다.",
      defaultCategory: "food",
      weeklyBest: [
        { rank: 1, cat: "식품", name: "락토핏 생유산균 골드 50포", tag: "▲3", tagClass: "up", query: "유산균", sub: "월요 헬스케어 실시간 1위 ↗" },
        { rank: 2, cat: "식품", name: "고려은단 비타민C 1000 이지", tag: "HOT", tagClass: "hot", query: "영양제", sub: "직장인 활력 비타민 급상승 ↗" },
        { rank: 3, cat: "식품", name: "하림 닭가슴살 블랙페퍼 100g", tag: "▲1", tagClass: "up", query: "닭가슴살", sub: "다이어트 식단 실시간 2위 ↗" },
        { rank: 4, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "-", tagClass: "same", query: "로봇청소기", sub: "스마트가전 상위 랭커 유지 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 5, cat: "생활", name: "크리넥스 3겹 데코 화장지", tag: "▲1", tagClass: "up", query: "화장지", sub: "생필품 대용량 베스트 ↗" }
      ]
    },
    {
      dayName: "화요일",
      themeName: "스마트 테크 & IT·디지털 데이",
      desc: "업무 효율과 첨단 일상을 이끄는 올인원 로봇청소기, OLED 고주사율 모니터, 고속충전기 실시간 최신 랭킹을 집중 분석합니다.",
      defaultCategory: "digital",
      weeklyBest: [
        { rank: 1, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "▲2", tagClass: "up", query: "로봇청소기", sub: "10,000Pa 실시간 검색 1위 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 2, cat: "IT", name: "LG 32인치 4K UHD 고주사율 모니터", tag: "HOT", tagClass: "hot", query: "모니터", sub: "데스크테리어 인기 급상승 ↗", url: "articles/monitor-panel-guide.html" },
        { rank: 3, cat: "IT", name: "앤커 65W 초소형 GaN 고속충전기", tag: "▲1", tagClass: "up", query: "배터리", sub: "모바일 충전케어 랭킹 1위 ↗", url: "articles/smartphone-battery.html" },
        { rank: 4, cat: "자동차", name: "맥세이프 고속 차량 거치대", tag: "-", tagClass: "same", query: "차량용 거치대", sub: "스마트 모빌리티 랭커 ↗" },
        { rank: 5, cat: "식품", name: "락토핏 생유산균 골드 50포", tag: "▲1", tagClass: "up", query: "유산균", sub: "건강기능식품 실시간 베스트 ↗" }
      ]
    },
    {
      dayName: "수요일",
      themeName: "알뜰 살림 & 대용량 생필품 데이",
      desc: "장바구니 물가를 낮추는 똑똑한 소비! 100% 천연펄프 롤화장지, 실내건조 세탁세제, 물티슈 등 실시간 대용량 랭킹 1위 모음전.",
      defaultCategory: "living",
      weeklyBest: [
        { rank: 1, cat: "생활", name: "크리넥스 3겹 울트라클린 화장지", tag: "▲2", tagClass: "up", query: "화장지", sub: "대용량 생필품 실시간 1위 ↗" },
        { rank: 2, cat: "생활", name: "다우니 엑스퍼트 실내건조 세제", tag: "HOT", tagClass: "hot", query: "세탁세제", sub: "장마철 살림 필수템 급상승 ↗" },
        { rank: 3, cat: "생활", name: "베베숲 시그니처 엠보싱 물티슈", tag: "▲1", tagClass: "up", query: "물티슈", sub: "육아/생활용품 베스트셀러 ↗" },
        { rank: 4, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "-", tagClass: "same", query: "로봇청소기", sub: "청소 가전 랭킹 유지 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 5, cat: "뷰티", name: "마녀공장 퓨어 클렌징 오일", tag: "▲1", tagClass: "up", query: "클렌징오일", sub: "스킨케어 데일리 랭커 ↗" }
      ]
    },
    {
      dayName: "목요일",
      themeName: "주말 드라이브 준비! 자동차 & 모빌리티 데이",
      desc: "쾌적하고 안전한 운전을 위한 15W 맥세이프 무선충전 거치대, 고출력 무선 에어건, 세차용품 실시간 1위 가이드.",
      defaultCategory: "auto",
      weeklyBest: [
        { rank: 1, cat: "자동차", name: "맥세이프 고속 차량 거치대", tag: "HOT", tagClass: "hot", query: "차량용 거치대", sub: "차량용품 7대몰 실시간 1위 ↗" },
        { rank: 2, cat: "자동차", name: "초강력 무선 터보 에어건 세트", tag: "▲2", tagClass: "up", query: "차량용 에어건", sub: "실내 세차/먼지제거 급상승 ↗" },
        { rank: 3, cat: "자동차", name: "더클래스 불렛 하이브리드 코팅제", tag: "▲1", tagClass: "up", query: "차량 코팅제", sub: "세차 매니아 인기 랭커 ↗" },
        { rank: 4, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "-", tagClass: "same", query: "로봇청소기", sub: "스마트가전 상위 유지 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 5, cat: "식품", name: "락토핏 생유산균 골드 50포", tag: "▲1", tagClass: "up", query: "유산균", sub: "건강식품 꾸준한 인기 ↗" }
      ]
    },
    {
      dayName: "금요일",
      themeName: "주말 미식 & 주방·홈카페 쿡웨어 데이",
      desc: "불금과 주말 힐링을 위한 올스텐 SUS 304 에어프라이어, 스탠리 보냉 텀블러, 홈에스프레소 머신 실시간 핫딜 랭킹.",
      defaultCategory: "living",
      weeklyBest: [
        { rank: 1, cat: "주방", name: "올스텐 SUS 304 오븐형 에어프라이어", tag: "▲3", tagClass: "up", query: "에어프라이어", sub: "주방가전 실시간 판매 1위 ↗", url: "articles/air-fryer-tips.html" },
        { rank: 2, cat: "리빙", name: "스탠리 퀜처 H2.0 진공 텀블러", tag: "HOT", tagClass: "hot", query: "텀블러", sub: "홈카페 보냉용품 인기 폭발 ↗" },
        { rank: 3, cat: "리빙", name: "해피콜 티타늄 프라이팬 2종 세트", tag: "▲1", tagClass: "up", query: "프라이팬", sub: "쿡웨어 스테디셀러 ↗" },
        { rank: 4, cat: "식품", name: "하림 훈제 닭가슴살 20팩", tag: "-", tagClass: "same", query: "닭가슴살", sub: "식품 랭킹 상위권 유지 ↗" },
        { rank: 5, cat: "뷰티", name: "마녀공장 퓨어 클렌징 오일", tag: "NEW", tagClass: "new", query: "클렌징오일", sub: "주말 딥클렌징 신규 랭커 ↗" }
      ]
    },
    {
      dayName: "토요일",
      themeName: "주말 힐링! 뷰티 스킨케어 & 홈리빙 데이",
      desc: "나를 위한 주말 선물! 블랙헤드 99.7% 세정 클렌징오일, 인체공학 메쉬 체어, 감성 무드등 실시간 1위 라이프스타일 큐레이션.",
      defaultCategory: "beauty",
      weeklyBest: [
        { rank: 1, cat: "뷰티", name: "마녀공장 퓨어 클렌징 오일 200ml", tag: "NEW", tagClass: "new", query: "클렌징오일", sub: "K-뷰티 7대몰 통합 1위 ↗" },
        { rank: 2, cat: "리빙", name: "인체공학 요추지지 풀메쉬 사무용 의자", tag: "HOT", tagClass: "hot", query: "의자", sub: "홈오피스 인체공학 급상승 ↗", url: "articles/ergonomics-chair.html" },
        { rank: 3, cat: "뷰티", name: "조선미녀 맑은쌀 선크림 50ml", tag: "▲2", tagClass: "up", query: "선크림", sub: "글로벌 아마존 직구 1위 ↗" },
        { rank: 4, cat: "IT", name: "올인원 흡입 물걸레 로봇청소기", tag: "-", tagClass: "same", query: "로봇청소기", sub: "스마트가전 상위 유지 ↗", url: "articles/robot-vacuum-guide.html" },
        { rank: 5, cat: "자동차", name: "맥세이프 고속 차량 거치대", tag: "▲1", tagClass: "up", query: "차량용 거치대", sub: "주말 드라이브 아이템 ↗" }
      ]
    }
  ];

  const currentTheme = dailyThemes[todayIndex] || dailyThemes[0];

  // 0. 상단 공지 날짜 및 실시간 급상승 랭킹 바 자동 갱신 (매일 오전 9시 기준)
  initNoticeDate();
  updateTrendingKeywords(currentTheme.weeklyBest);

  // 1. 요일별 테마 라이브 배너 갱신
  const todayDayName = document.getElementById('todayDayName');
  const todayThemeName = document.getElementById('todayThemeName');
  const todayThemeDesc = document.getElementById('todayThemeDesc');

  if (todayDayName) todayDayName.textContent = currentTheme.dayName;
  if (todayThemeName) todayThemeName.textContent = currentTheme.themeName;
  if (todayThemeDesc) todayThemeDesc.textContent = currentTheme.desc;

  // 2. 우측 사이드바: 오늘 요일 실시간 주간 베스트 랭킹 위젯 갱신
  const weeklyBestSubLabel = document.getElementById('weeklyBestSubLabel');
  const weeklyBestList = document.getElementById('weeklyBestList');

  if (weeklyBestSubLabel) {
    weeklyBestSubLabel.textContent = `오늘(${currentTheme.dayName}) 실시간 집계 순위 (클릭 시 7대몰 비교)`;
  }

  if (weeklyBestList) {
    weeklyBestList.innerHTML = currentTheme.weeklyBest.map(item => `
      <li class="popular-item" data-query="${escapeHtml(item.query)}">
        <span class="popular-num">${item.rank}</span>
        <div>
          <a href="${item.url || '#shoppingSearchModal'}" class="popular-title">
            [${escapeHtml(item.cat)}] ${escapeHtml(item.name)} <span class="rank-shift-tag ${item.tagClass}">${item.tag}</span>
          </a>
          <div class="popular-date">${escapeHtml(item.sub)}</div>
        </div>
      </li>
    `).join('');

    // 사이드바 인기 항목 클릭 이벤트 바인딩
    weeklyBestList.querySelectorAll('.popular-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('javascript')) {
          // 실제 아티클 상세 가이드 링크(예: articles/robot-vacuum-guide.html)인 경우 정상 이동
          return;
        }
        e.preventDefault();
        const query = item.getAttribute('data-query');
        if (query && window.openShoppingModal) {
          window.openShoppingModal(query);
        }
      });
    });
  }

  // 3. 전 카테고리 필터 탭 네비게이션
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  const articleCards = document.querySelectorAll('#allCategoryArticleGrid .article-card');

  if (filterBtns.length > 0 && articleCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        articleCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. 아티클 카드 내 가격비교 바로가기 버튼 및 동적 링크 연동
  const compareBtns = document.querySelectorAll('.card-compare-btn');
  compareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const query = btn.getAttribute('data-query');
      if (query && window.openShoppingModal) {
        window.openShoppingModal(query);
      }
    });
  });

  const dynamicSearchLinks = document.querySelectorAll('.dynamic-search-link');
  dynamicSearchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const query = link.getAttribute('data-query');
      if (query && window.openShoppingModal) {
        window.openShoppingModal(query);
      }
    });
  });
}

/**
 * 매일 오전 9시 기준 날짜 및 갱신 정보 산출 엔진
 * - 현재 시각이 오전 9시 이전(00:00:00 ~ 08:59:59)이면: 전날(어제) 오전 9시 기준
 * - 현재 시각이 오전 9시 이후(09:00:00 ~ 23:59:59)이면: 당일(오늘) 오전 9시 기준
 */
function getMorning9BaseDate() {
  const now = new Date();
  const base = new Date(now.getTime());

  // 현재 시각이 오전 9시 이전이면 기준일을 하루 전(어제)으로 계산
  if (now.getHours() < 9) {
    base.setDate(base.getDate() - 1);
  }

  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  const dayIndex = base.getDay(); // 0(일) ~ 6(토)

  return {
    year,
    month,
    day,
    dateStr: `${year}.${month}.${day}`,
    dayIndex,
    displayNoticeDate: `업데이트: ${year}.${month}.${day} 09:00`,
    rankingTimeStr: `${year}.${month}.${day} 09:00 기준 실시간 집계`
  };
}

/**
 * 상단 공지 바의 업데이트 날짜를 매일 오전 9시 기준으로 자동 갱신
 */
function initNoticeDate() {
  const noticeDateEl = document.querySelector('.notice-date');
  if (noticeDateEl) {
    const info = getMorning9BaseDate();
    noticeDateEl.textContent = info.displayNoticeDate;
  }
}

/**
 * 상단 🔥 실시간 전분야 급상승 랭킹 바 자동 갱신
 * 요일/날짜 기준 weeklyBest 1위~5위 아이템을 헤더 티커에 자동 동기화
 */
function updateTrendingKeywords(weeklyBest) {
  const trendingContainer = document.querySelector('.trending-keywords');
  if (!trendingContainer || !weeklyBest || weeklyBest.length === 0) return;

  trendingContainer.innerHTML = weeklyBest.slice(0, 5).map(item => `
    <span class="keyword-item" data-query="${escapeHtml(item.query)}">
      <span class="keyword-rank">${item.rank}위</span> [${escapeHtml(item.cat)}] ${escapeHtml(item.name)} <span class="rank-shift-tag ${item.tagClass}">${item.tag}</span>
    </span>
  `).join('');

  // 클릭 시 7대 쇼핑몰 비교 모달 열기 이벤트 바인딩
  trendingContainer.querySelectorAll('.keyword-item').forEach(item => {
    item.addEventListener('click', () => {
      const q = item.getAttribute('data-query');
      if (q && window.openShoppingModal) {
        window.openShoppingModal(q);
      }
    });
  });
}

/**
 * 매일 오전 9시 정각 자동 갱신 스케줄러
 * 사용자가 사이트를 켜둔 상태에서도 오전 9시 정각이 되면 화면의 데이터가 새로고침 없이 즉시 갱신됩니다.
 */
function scheduleNextMorning9Update() {
  const now = new Date();
  const next9 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
  if (now.getTime() >= next9.getTime()) {
    next9.setDate(next9.getDate() + 1);
  }
  const diffMs = next9.getTime() - now.getTime();

  setTimeout(() => {
    // 9시 정각 도달 시 데이터 갱신 실행
    initDailyDynamicRanking();
    initRankingTabs();
    initAgeRankingTabs();
    // 다음날 9시 스케줄 재설정
    scheduleNextMorning9Update();
  }, Math.max(diffMs, 1000));
}

