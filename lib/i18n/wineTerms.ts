/**
 * Chinese tasting vocabulary.
 *
 * English stays the stored value in every case — the database, the label
 * extraction schema, and existing rows all use it. This file is a display layer
 * only, so switching language never rewrites data and the same bottle logged in
 * either language is the same record.
 *
 * Terms follow the standard Chinese wine-tasting vocabulary rather than literal
 * translation: 石榴红 for Garnet, 醋栗 for Gooseberry, 甘草 for Liquorice. Where a
 * term has no settled Chinese equivalent the choice is noted inline.
 */

export const WINE_TYPE_ZH: Record<string, string> = {
  Red: '红葡萄酒',
  White: '白葡萄酒',
  'Rosé': '桃红葡萄酒',
  Sparkling: '起泡酒',
  Fortified: '加强酒',
}

export const CLARITY_ZH: Record<string, string> = {
  Clear: '清澈',
  Hazy: '混浊',
}

export const INTENSITY_ZH: Record<string, string> = {
  Pale: '淡',
  Medium: '中',
  Deep: '深',
}

export const COLOR_ZH: Record<string, string> = {
  // White
  Lemon: '柠檬色',
  Gold: '金黄色',
  Amber: '琥珀色',
  // Rosé
  Pink: '粉红色',
  Salmon: '粉橘色',
  Orange: '橙色',
  // Red
  Purple: '紫红色',
  Ruby: '宝石红色',
  Garnet: '石榴红色',
  Tawny: '茶色',
}

export const SWEETNESS_ZH: Record<string, string> = {
  Dry: '干',
  Medium: '半甜',
  Sweet: '甜',
}

export const LEVEL_ZH: Record<string, string> = {
  Low: '低',
  Medium: '中',
  High: '高',
}

export const BODY_ZH: Record<string, string> = {
  Light: '轻盈',
  Medium: '中',
  Full: '饱满',
}

export const MOUSSE_ZH: Record<string, string> = {
  Delicate: '细腻',
  Creamy: '绵密',
  Aggressive: '粗犷',
}

export const FINISH_ZH: Record<string, string> = {
  Short: '短',
  Medium: '中',
  Long: '长',
}

export const QUALITY_ZH: Record<string, string> = {
  Poor: '差',
  Acceptable: '可接受',
  Good: '好',
  'Very Good': '很好',
  Outstanding: '特好',
}

/** Primary / secondary / tertiary, phrased the way the categories read in Chinese. */
export const AROMA_GROUP_ZH: Record<string, string> = {
  Primary: '一类香气',
  Secondary: '二类香气',
  Tertiary: '三类香气',
}

export const AROMA_CATEGORY_ZH: Record<string, string> = {
  Citrus: '柑橘类水果',
  'Green Fruit': '绿色水果',
  'Stone Fruit': '核果',
  'Tropical Fruit': '热带水果',
  'Red Fruit': '红色水果',
  'Black Fruit': '黑色水果',
  Floral: '花香',
  Herbal: '草本植物',
  Spice: '香料',
  Yeast: '酵母',
  Malolactic: '苹果酸—乳酸转化',
  Oak: '橡木',
  'Dried Fruit': '果干',
  Nutty: '坚果',
  Earth: '泥土',
  Leather: '皮革',
  Tobacco: '烟草',
  Mushroom: '蘑菇',
  Honey: '蜂蜜',
  Caramel: '焦糖',
  Chocolate: '巧克力',
}

export const AROMA_DESCRIPTOR_ZH: Record<string, string> = {
  // Citrus
  Lemon: '柠檬',
  Lime: '青柠',
  Grapefruit: '西柚',
  Orange: '橙子',
  // Green fruit
  'Green Apple': '青苹果',
  Pear: '梨',
  Gooseberry: '醋栗',
  // Stone fruit
  Peach: '桃',
  Apricot: '杏',
  Nectarine: '油桃',
  // Tropical
  Banana: '香蕉',
  Pineapple: '菠萝',
  Mango: '杧果',
  'Passion Fruit': '西番莲果',
  // Red fruit
  Strawberry: '草莓',
  Raspberry: '覆盆子',
  'Red Cherry': '红樱桃',
  Plum: '红李子',
  Redcurrant: '红醋栗',
  // Black fruit
  Blackberry: '黑莓',
  Blackcurrant: '黑醋栗',
  Blueberry: '蓝莓',
  'Black Cherry': '黑樱桃',
  // Floral
  Blossom: '花丛',
  Rose: '玫瑰',
  Violet: '紫罗兰',
  // Herbal
  'Green Bell Pepper': '青圆椒',
  Grass: '青草',
  Mint: '薄荷',
  Eucalyptus: '桉树',
  // Spice
  'Black Pepper': '黑胡椒',
  Liquorice: '甘草',
  Cinnamon: '桂皮',
  // Yeast
  Bread: '面包',
  Pastry: '油酥糕点',
  Biscuit: '饼干',
  Brioche: '面包面团',
  // Malolactic
  Butter: '黄油',
  Cream: '奶油',
  Cheese: '奶酪',
  // Oak
  Vanilla: '香草',
  Toast: '烤面包',
  Cedar: '雪松',
  Coconut: '椰子',
  Smoke: '烟熏',
  // Dried fruit
  Fig: '无花果',
  Prune: '西梅干',
  Raisin: '葡萄干',
  Sultana: '无核白葡萄干',
  Marmalade: '橘子酱',
  // Nutty
  Almond: '杏仁',
  Hazelnut: '榛子',
  Walnut: '核桃',
  Marzipan: '杏仁膏',
  // Earth
  'Wet Leaves': '湿树叶',
  'Forest Floor': '森林地表',
  Clay: '黏土',
  Mineral: '湿石头',
  // Leather
  Leather: '皮革',
  Suede: '麂皮',
  Game: '野味',
  // Tobacco
  Tobacco: '烟草',
  'Cigar Box': '雪茄盒',
  'Dried Leaves': '干树叶',
  // Mushroom
  Mushroom: '蘑菇',
  Truffle: '松露',
  // Honey
  Honey: '蜂蜜',
  Beeswax: '蜂蜡',
  // Caramel
  Caramel: '焦糖',
  Toffee: '太妃糖',
  Butterscotch: '奶油糖',
  // Chocolate
  'Dark Chocolate': '黑巧克力',
  Coffee: '咖啡',
  Mocha: '摩卡',
}

// Scales share words across fields (Medium is both an intensity and a body), so
// they are looked up per-field rather than through the catch-all below.
const SCALE_MAPS: Record<string, Record<string, string>> = {
  clarity: CLARITY_ZH,
  intensity: INTENSITY_ZH,
  sweetness: SWEETNESS_ZH,
  level: LEVEL_ZH,
  body: BODY_ZH,
  mousse: MOUSSE_ZH,
  finish: FINISH_ZH,
  quality: QUALITY_ZH,
  wineType: WINE_TYPE_ZH,
  color: COLOR_ZH,
}

export type ScaleName = keyof typeof SCALE_MAPS

/**
 * Render a stored English term in the given locale.
 *
 * `scale` disambiguates the shared words: "Medium" is 中 either way, but "Low"
 * as an acidity level and "Light" as a body are different scales, and keeping
 * them separate means a future wording change to one does not silently move the
 * other.
 *
 * Unmapped values fall through to the English so a new term renders as itself
 * rather than as a blank chip.
 */
export function term(value: string, locale: 'zh' | 'en', scale?: ScaleName): string {
  if (locale === 'en' || !value) return value
  if (scale) return SCALE_MAPS[scale][value] ?? value
  return (
    AROMA_DESCRIPTOR_ZH[value] ??
    AROMA_CATEGORY_ZH[value] ??
    AROMA_GROUP_ZH[value] ??
    COLOR_ZH[value] ??
    WINE_TYPE_ZH[value] ??
    QUALITY_ZH[value] ??
    value
  )
}
