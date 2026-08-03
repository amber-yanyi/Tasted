import type { Locale } from './locale'

/**
 * UI copy.
 *
 * Both languages are required on every key, so a missing translation is a type
 * error rather than an English string leaking into the Chinese interface.
 *
 * Two things stay English in the Chinese UI by design: the product name and the
 * landing slogan. This is a wine-world convention as much as a branding one —
 * the audience reads English comfortably, and a translated slogan would lose the
 * cadence without gaining clarity.
 */
export const STRINGS = {
  // ── Chrome ──
  addTasting: { zh: '记一笔', en: 'Add Tasting' },
  tastings: { zh: '品酒笔记', en: 'Tastings' },
  logIn: { zh: '登录', en: 'Log In' },
  signUp: { zh: '注册', en: 'Sign Up' },
  logOut: { zh: '退出', en: 'Log Out' },
  loggingOut: { zh: '退出中…', en: 'Logging out...' },

  // ── Landing ──
  landingLede: {
    // Kept in English: the slogan carries the brand voice.
    zh: 'A wine you finish and forget is a wine you never really tasted. Keep the note, and your palate becomes something you can look back on.',
    en: 'A wine you finish and forget is a wine you never really tasted. Keep the note, and your palate becomes something you can look back on.',
  },
  getStarted: { zh: '开始记录', en: 'Get Started' },
  viewTastings: { zh: '查看笔记', en: 'View Tastings' },
  featureLabelTitle: { zh: '拍下酒标', en: 'Photograph the label' },
  featureLabelBody: {
    zh: '酒名、酒庄、年份、产区、葡萄品种自动填好 —— 连酒标上没印的也一样。',
    en: 'The wine, producer, vintage, region, and grape fill themselves in — even the ones the label never prints.',
  },
  featureNotesTitle: { zh: '用自己的话记下来', en: 'Taste in your own words' },
  featureNotesBody: {
    zh: '有结构地记下你闻到、尝到的东西，一年后再看依然读得懂。',
    en: 'A structured form for what you actually smelled and tasted, so a note written tonight still means something a year from now.',
  },
  featurePhoneTitle: { zh: '装进手机', en: 'Keep it on your phone' },
  featurePhoneBody: {
    zh: '添加到主屏幕就像一个 app —— 餐桌上、酒吧里，酒在哪儿就在哪儿打开。',
    en: 'Add it to your home screen and it opens like an app — at the table, at the bar, wherever the bottle is.',
  },

  // ── Auth ──
  email: { zh: '邮箱', en: 'Email' },
  password: { zh: '密码', en: 'Password' },
  welcomeBack: { zh: '欢迎回来', en: 'Welcome Back' },
  createAccount: { zh: '创建账号', en: 'Create Account' },
  creatingAccount: { zh: '创建中…', en: 'Creating account...' },
  loggingIn: { zh: '登录中…', en: 'Logging in...' },
  continueWithGoogle: { zh: '使用 Google 登录', en: 'Continue with Google' },
  or: { zh: '或', en: 'or' },
  noAccountYet: { zh: '还没有账号？', en: "Don't have an account?" },
  haveAccount: { zh: '已有账号？', en: 'Already have an account?' },
  checkEmail: {
    zh: '请查看邮箱，点击确认链接完成注册。',
    en: 'Check your email for a confirmation link.',
  },

  // ── Label capture ──
  captureTitle: { zh: '拍下酒标', en: 'Photograph the label' },
  captureHint: {
    zh: '我们会填好酒名、酒庄、年份和产区。可跳过 —— 也可以全部手填。',
    en: "We'll fill in the wine, producer, vintage, and region. Optional — you can type everything by hand instead.",
  },
  captureButton: { zh: '拍照或选择照片', en: 'Take or choose a photo' },
  captureReading: { zh: '识别中…', en: 'Reading…' },
  captureReadingLabel: { zh: '正在识别酒标…', en: 'Reading the label…' },
  captureReplace: { zh: '换一张', en: 'Replace photo' },
  captureRemove: { zh: '移除', en: 'Remove' },
  captureSaved: { zh: '酒标已随这条笔记保存。', en: 'Label saved with this tasting.' },
  captureNothingRead: {
    zh: '这张照片没能识别出内容。可以重拍，或在下面手动填写。',
    en: 'Nothing readable on that photo. Try again, or fill the details in below.',
  },
  captureUnreachable: { zh: '无法连接识别服务。', en: 'Could not reach the label reader.' },
  captureFilledOne: { zh: '已填好 1 项，有偏差可以直接改。', en: 'Filled in 1 detail below. Edit anything that looks off.' },
  captureFilledMany: { zh: '已填好 {n} 项，有偏差可以直接改。', en: 'Filled in {n} details below. Edit anything that looks off.' },

  // ── Form sections ──
  sectionIdentity: { zh: '酒款信息', en: 'Wine Identity' },
  sectionAppearance: { zh: '视觉：外观', en: 'Appearance' },
  sectionPalate: { zh: '嗅觉与味觉', en: 'Nose & Palate' },
  sectionAromas: { zh: '香气与风味', en: 'Aromas & Flavors' },
  sectionConclusions: { zh: '评估', en: 'Conclusions' },

  // ── Form fields ──
  wineName: { zh: '酒名', en: 'Wine Name' },
  wineType: { zh: '类型', en: 'Wine Type' },
  vintage: { zh: '年份', en: 'Vintage' },
  producer: { zh: '酒庄', en: 'Producer' },
  region: { zh: '产区', en: 'Region' },
  country: { zh: '国家', en: 'Country' },
  grapeVariety: { zh: '葡萄品种', en: 'Grape Variety' },
  alcohol: { zh: '酒精度 %', en: 'Alcohol %' },
  clarity: { zh: '澄清度', en: 'Clarity' },
  intensity: { zh: '颜色深度', en: 'Intensity' },
  color: { zh: '颜色', en: 'Color' },
  sweetness: { zh: '甜度', en: 'Sweetness' },
  acidity: { zh: '酸度', en: 'Acidity' },
  tannin: { zh: '单宁', en: 'Tannin' },
  body: { zh: '酒体', en: 'Body' },
  mousse: { zh: '气泡', en: 'Mousse' },
  finish: { zh: '余味', en: 'Finish' },
  qualityLevel: { zh: '质量等级', en: 'Quality Level' },
  notesOptional: { zh: '备注（可选）', en: 'Notes (optional)' },
  selectPlaceholder: { zh: '请选择…', en: 'Select...' },
  vintagePlaceholder: { zh: '如 2020', en: 'e.g. 2020' },
  regionPlaceholder: { zh: '如 巴罗萨谷、勃艮第', en: 'e.g. Barossa Valley, Burgundy' },
  countryPlaceholder: { zh: '如 法国', en: 'e.g. France' },
  grapePlaceholder: { zh: '如 霞多丽，或 西拉、歌海娜', en: 'e.g. Chardonnay, or Syrah, Grenache' },

  chooseTypeTitle: { zh: '先选一个类型，开始品鉴', en: 'Select a Wine Type to begin tasting' },
  chooseTypeBody: {
    zh: '选好之后，完整的品鉴表就会展开。',
    en: 'The full tasting form will appear once you choose above.',
  },

  saveTasting: { zh: '保存笔记', en: 'Save Tasting' },
  saving: { zh: '保存中…', en: 'Saving...' },
  updateTasting: { zh: '更新笔记', en: 'Update Tasting' },
  updating: { zh: '更新中…', en: 'Updating...' },

  // ── List & detail ──
  noTastingsYet: { zh: '还没有笔记。', en: 'No tastings yet.' },
  addFirstTasting: { zh: '记下第一瓶酒', en: 'Add your first tasting' },
  backToTastings: { zh: '返回笔记列表', en: 'Back to Tastings' },
  backToTasting: { zh: '返回这条笔记', en: 'Back to Tasting' },
  edit: { zh: '编辑', en: 'Edit' },
  delete: { zh: '删除', en: 'Delete' },
  deleting: { zh: '删除中…', en: 'Deleting...' },
  labelHeading: { zh: '酒标', en: 'Label' },
  notesHeading: { zh: '备注', en: 'Notes' },
  editTastingTitle: { zh: '编辑笔记', en: 'Edit Tasting' },
  addTastingTitle: { zh: '记一笔', en: 'Add Tasting' },
  tastingNotFound: { zh: '找不到这条笔记。', en: 'Tasting not found.' },
  confirmDelete: {
    zh: '确定要删除这条笔记吗？此操作无法撤销。',
    en: 'Are you sure you want to delete this tasting? This cannot be undone.',
  },
  mustBeLoggedIn: { zh: '需要先登录。', en: 'You must be logged in' },
  errorLoading: { zh: '加载笔记出错：', en: 'Error loading tastings: ' },
  labelUploadFailed: {
    zh: '酒标上传失败，笔记将不带照片保存。',
    en: 'Could not upload the label photo. Saving the tasting without it.',
  },
  labelUploadFailedKeep: {
    zh: '新酒标上传失败，保留原来那张。',
    en: 'Could not upload the new label photo. Keeping the previous one.',
  },
} as const

export type StringKey = keyof typeof STRINGS

/** Look up a UI string, with optional {n}-style interpolation. */
export function t(
  key: StringKey,
  locale: Locale,
  vars?: Record<string, string | number>
): string {
  let out: string = STRINGS[key][locale]
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      out = out.replace(`{${name}}`, String(value))
    }
  }
  return out
}
