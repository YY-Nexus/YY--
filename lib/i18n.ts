export type Locale = "zh-CN" | "en-US" | "ja-JP" | "ko-KR"

export type TranslationKey =
  | "nav.toggle.expand"
  | "nav.toggle.collapse"
  | "nav.search.placeholder"
  | "nav.search.noResults"
  | "nav.ai.title"
  | "nav.ai.refresh"
  | "nav.history.title"
  | "nav.history.clear"
  | "nav.history.remove"
  | "nav.favorites.title"
  | "nav.favorites.add"
  | "nav.favorites.remove"
  | "nav.favorites.empty"
  | "nav.favorites.dialog.title"
  | "nav.favorites.dialog.search"
  | "nav.language.title"
  | "nav.theme.title"
  | "nav.theme.reset"
  | "nav.theme.appearance"
  | "nav.theme.behavior"
  | "nav.theme.primaryColor"
  | "nav.theme.accentColor"
  | "nav.theme.fontSize"
  | "nav.theme.density"
  | "nav.theme.animation"
  | "nav.theme.apply"

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  "zh-CN": {
    "nav.toggle.expand": "展开导航",
    "nav.toggle.collapse": "收起导航",
    "nav.search.placeholder": "搜索功能...",
    "nav.search.noResults": "未找到结果",
    "nav.ai.title": "智能推荐",
    "nav.ai.refresh": "刷新推荐",
    "nav.history.title": "最近访问",
    "nav.history.clear": "清空历史",
    "nav.history.remove": "移除",
    "nav.favorites.title": "我的收藏",
    "nav.favorites.add": "添加收藏",
    "nav.favorites.remove": "取消收藏",
    "nav.favorites.empty": "暂无收藏，点击 + 添加",
    "nav.favorites.dialog.title": "添加到收藏",
    "nav.favorites.dialog.search": "搜索功能...",
    "nav.language.title": "语言设置",
    "nav.theme.title": "个性化设置",
    "nav.theme.reset": "重置",
    "nav.theme.appearance": "外观",
    "nav.theme.behavior": "行为",
    "nav.theme.primaryColor": "主题色",
    "nav.theme.accentColor": "强调色",
    "nav.theme.fontSize": "字体大小",
    "nav.theme.density": "密度",
    "nav.theme.animation": "动画效果",
    "nav.theme.apply": "应用设置",
  },
  "en-US": {
    "nav.toggle.expand": "Expand Navigation",
    "nav.toggle.collapse": "Collapse Navigation",
    "nav.search.placeholder": "Search features...",
    "nav.search.noResults": "No results found",
    "nav.ai.title": "Smart Recommendations",
    "nav.ai.refresh": "Refresh",
    "nav.history.title": "Recent",
    "nav.history.clear": "Clear All",
    "nav.history.remove": "Remove",
    "nav.favorites.title": "Favorites",
    "nav.favorites.add": "Add to Favorites",
    "nav.favorites.remove": "Remove from Favorites",
    "nav.favorites.empty": "No favorites yet. Click + to add",
    "nav.favorites.dialog.title": "Add to Favorites",
    "nav.favorites.dialog.search": "Search features...",
    "nav.language.title": "Language",
    "nav.theme.title": "Personalization",
    "nav.theme.reset": "Reset",
    "nav.theme.appearance": "Appearance",
    "nav.theme.behavior": "Behavior",
    "nav.theme.primaryColor": "Primary Color",
    "nav.theme.accentColor": "Accent Color",
    "nav.theme.fontSize": "Font Size",
    "nav.theme.density": "Density",
    "nav.theme.animation": "Animation",
    "nav.theme.apply": "Apply Settings",
  },
  "ja-JP": {
    "nav.toggle.expand": "ナビゲーションを展開",
    "nav.toggle.collapse": "ナビゲーションを折りたたむ",
    "nav.search.placeholder": "機能を検索...",
    "nav.search.noResults": "結果が見つかりません",
    "nav.ai.title": "スマートレコメンド",
    "nav.ai.refresh": "更新",
    "nav.history.title": "最近の訪問",
    "nav.history.clear": "履歴をクリア",
    "nav.history.remove": "削除",
    "nav.favorites.title": "お気に入り",
    "nav.favorites.add": "お気に入りに追加",
    "nav.favorites.remove": "お気に入りから削除",
    "nav.favorites.empty": "お気に入りはまだありません。+をクリックして追加",
    "nav.favorites.dialog.title": "お気に入りに追加",
    "nav.favorites.dialog.search": "機能を検索...",
    "nav.language.title": "言語設定",
    "nav.theme.title": "パーソナライズ",
    "nav.theme.reset": "リセット",
    "nav.theme.appearance": "外観",
    "nav.theme.behavior": "動作",
    "nav.theme.primaryColor": "メインカラー",
    "nav.theme.accentColor": "アクセントカラー",
    "nav.theme.fontSize": "フォントサイズ",
    "nav.theme.density": "密度",
    "nav.theme.animation": "アニメーション",
    "nav.theme.apply": "設定を適用",
  },
  "ko-KR": {
    "nav.toggle.expand": "내비게이션 확장",
    "nav.toggle.collapse": "내비게이션 축소",
    "nav.search.placeholder": "기능 검색...",
    "nav.search.noResults": "결과를 찾을 수 없습니다",
    "nav.ai.title": "스마트 추천",
    "nav.ai.refresh": "새로고침",
    "nav.history.title": "최근 방문",
    "nav.history.clear": "기록 지우기",
    "nav.history.remove": "제거",
    "nav.favorites.title": "즐겨찾기",
    "nav.favorites.add": "즐겨찾기에 추가",
    "nav.favorites.remove": "즐겨찾기에서 제거",
    "nav.favorites.empty": "즐겨찾기가 없습니다. +를 클릭하여 추가",
    "nav.favorites.dialog.title": "즐겨찾기에 추가",
    "nav.favorites.dialog.search": "기능 검색...",
    "nav.language.title": "언어 설정",
    "nav.theme.title": "개인화 설정",
    "nav.theme.reset": "초기화",
    "nav.theme.appearance": "외관",
    "nav.theme.behavior": "동작",
    "nav.theme.primaryColor": "주 색상",
    "nav.theme.accentColor": "강조 색상",
    "nav.theme.fontSize": "글꼴 크기",
    "nav.theme.density": "밀도",
    "nav.theme.animation": "애니메이션",
    "nav.theme.apply": "설정 적용",
  },
}
