/** Simplified Chinese names for ingredients, matched by keyword (first match wins). Not checked by a native speaker. */
const RULES: Array<[RegExp, string]> = [
  [/minced chicken or lean beef/, "鸡肉碎/瘦牛肉碎"], [/minced chicken/, "鸡肉碎"], [/chicken wings/, "鸡翅"], [/drumstick|chicken leg/, "鸡腿"], [/chicken thigh/, "鸡腿肉"], [/chicken breast/, "鸡胸肉"],
  [/whole chicken/, "整只鸡"], [/minced chicken or lean beef/, "鸡肉碎/瘦牛肉碎"], [/minced chicken/, "鸡肉碎"],
  [/minced beef|ground beef/, "牛肉碎"], [/beef brisket/, "牛腩"], [/beef shin|chuck/, "牛腱/牛肩肉"], [/beef sirloin|beef/, "牛肉"],
  [/pork ribs/, "排骨"], [/minced pork|lean minced pork/, "猪肉碎"], [/pork loin|lean pork|pork/, "猪肉"],
  [/prawn/, "虾"], [/squid/, "鱿鱼"], [/clam/, "蛤蜊"], [/scallop/, "扇贝"], [/mussel/, "青口"],
  [/salmon/, "三文鱼"], [/mackerel or sea bass/, "鲭鱼/鲈鱼"], [/sea bass/, "鲈鱼"], [/cod/, "鳕鱼"], [/mackerel/, "鲭鱼"], [/tuna/, "金枪鱼"], [/white fish/, "白肉鱼"],
  [/egg tofu/, "玉子豆腐"], [/silken tofu|soft tofu/, "嫩豆腐"], [/firm tofu/, "老豆腐"], [/tempeh/, "天贝"], [/^eggs?$/, "鸡蛋"],
  [/dried scallops/, "干贝/红枣"], [/dried octopus/, "干章鱼/红枣"], [/dried figs|honey dates/, "无花果干/蜜枣"],
  [/red dates/, "红枣"], [/goji/, "枸杞"], [/wood ear/, "黑木耳"], [/dried shiitake|shiitake/, "香菇"], [/enoki/, "金针菇"],
  [/button mushroom|mushrooms/, "蘑菇"], [/wakame/, "裙带菜"], [/miso/, "味噌"],
  [/bok choy/, "小白菜"], [/choy sum|mustard greens/, "菜心"], [/kailan/, "芥兰"], [/yin choy/, "苋菜"], [/napa/, "大白菜"],
  [/water spinach|kangkong/, "空心菜"], [/spinach/, "菠菜"], [/watercress/, "西洋菜"], [/romaine|lettuce/, "生菜"], [/cabbage/, "包菜"],
  [/chinese chives/, "韭菜"], [/spring onion/, "葱"], [/celery/, "西芹"], [/coriander/, "香菜"], [/parsley/, "欧芹"],
  [/broccoli/, "西兰花"], [/cauliflower/, "花椰菜"], [/zucchini/, "意大利青瓜"], [/old cucumber/, "老黄瓜"], [/cucumber/, "青瓜"],
  [/winter melon/, "冬瓜"], [/green papaya/, "青木瓜"], [/chayote/, "佛手瓜"], [/pumpkin/, "南瓜"], [/lotus root/, "莲藕"],
  [/white radish/, "白萝卜"], [/carrot/, "红萝卜"], [/sweet potato/, "红薯"], [/potato/, "土豆"], [/baby corn/, "玉米笋"],
  [/sweet corn|corn kernels/, "甜玉米"], [/green beans|long beans/, "四季豆/长豆"], [/snow peas/, "荷兰豆"], [/green peas/, "青豆"],
  [/edamame/, "毛豆"], [/bean sprouts/, "豆芽"], [/okra/, "秋葵"], [/eggplant/, "茄子"], [/capsicum/, "甜椒"],
  [/cherry tomato|tomato paste|canned tomatoes|tomato/, "番茄"], [/water chestnut/, "马蹄"], [/pear or apple/, "梨/苹果"],
  [/onion|shallot/, "洋葱/红葱头"], [/garlic powder/, "蒜粉"], [/garlic/, "蒜头"], [/ginger/, "姜"], [/galangal/, "南姜"],
  [/lemongrass/, "香茅"], [/kaffir/, "青柠叶"], [/pandan/, "香兰叶"], [/thai basil/, "九层塔"], [/chilli powder/, "辣椒粉"],
  [/red chilli|chilli/, "辣椒"], [/papaya/, "木瓜"], [/banana/, "香蕉"], [/^pear$/, "梨"], [/^orange$/, "橙"], [/^apple$/, "苹果"], [/guava/, "番石榴"], [/watermelon/, "西瓜"], [/lemon/, "柠檬"], [/lime/, "青柠"],
  [/low salt|reduced-sodium|light soy/, "低盐生抽"], [/sweet soy|kecap/, "甜酱油"], [/oyster sauce/, "蚝油"], [/fish sauce/, "鱼露"],
  [/shaoxing/, "绍兴酒"], [/mirin/, "味醂"], [/rice vinegar/, "米醋"], [/tamarind/, "罗望子"], [/sesame oil/, "香油"],
  [/olive oil/, "橄榄油"], [/cooking oil/, "食用油"], [/sesame seeds/, "芝麻"], [/coconut milk/, "椰浆"], [/grated coconut/, "椰丝"], [/asparagus/, "芦笋"], [/taro/, "芋头"], [/peanuts/, "花生"],
  [/white pepper|black pepper|peppercorns/, "胡椒"], [/five-spice/, "五香粉"], [/star anise/, "八角"], [/cinnamon/, "肉桂"],
  [/turmeric/, "姜黄"], [/curry powder/, "咖喱粉"], [/cumin/, "孜然"], [/paprika/, "红椒粉"], [/nutmeg/, "肉豆蔻"],
  [/oregano|thyme|rosemary|basil|dill|herbs/, "香草"], [/^salt$/, "盐"], [/cornflour/, "玉米粉"], [/plain flour/, "面粉"],
  [/breadcrumbs/, "面包糠"], [/rolled oats/, "燕麦片"], [/glass noodles/, "冬粉"], [/bee hoon|vermicelli/, "米粉"], [/kway teow/, "河粉"], [/egg noodles/, "鸡蛋面"], [/mee sua/, "面线"], [/udon/, "乌冬面"], [/soba/, "荞麦面"], [/spaghetti/, "意大利面"], [/wholemeal bread/, "全麦面包"], [/wraps/, "薄饼皮"], [/yoghurt/, "酸奶"], [/tuna/, "金枪鱼"], [/cooked rice/, "隔夜饭"], [/^rice$/, "米"],
  [/chickpeas/, "鹰嘴豆"], [/white beans/, "白豆"], [/red lentils/, "红扁豆"], [/water/, "水"],
];

export function ingredientZh(name: string): string | undefined {
  const n = name.toLowerCase();
  for (const [re, zh] of RULES) if (re.test(n)) return zh;
  return undefined;
}
