/**
 * data.js - ゲームマスターデータ
 * 金属データ（実際の融点）・クラフトレシピ定義
 */

'use strict';

/* ============================================================  
   金属マスターデータ（全20種・実際の融点使用）  
   ============================================================ */  
const METALS = {  
  /* ===== 既存10種 ===== */  
  tin:       { id:'tin',       name:'スズ',       nameEn:'Tin',        icon:'🔩', meltingPoint:232,  description:'軟らかく融点が低い金属。最も溶かしやすく初心者向け。',         color:'#a8c0cc' },  
  lead:      { id:'lead',      name:'鉛',         nameEn:'Lead',       icon:'⬛', meltingPoint:327,  description:'重くて柔らかい金属。融点が比較的低く扱いやすい。',             color:'#6b7280' },  
  zinc:      { id:'zinc',      name:'亜鉛',       nameEn:'Zinc',       icon:'🔷', meltingPoint:420,  description:'銀白色の金属。さびにくく板金・めっきに使われる。',             color:'#93c5fd' },  
  aluminum:  { id:'aluminum',  name:'アルミ',     nameEn:'Aluminum',   icon:'🪙', meltingPoint:660,  description:'軽くて扱いやすい金属。日用品から航空機まで幅広く使われる。',   color:'#d1d5db' },  
  silver:    { id:'silver',    name:'銀',         nameEn:'Silver',     icon:'⚪', meltingPoint:962,  description:'美しい光沢を持つ貴金属。アクセサリーや食器に使われる。',       color:'#e2e8f0' },  
  gold:      { id:'gold',      name:'金',         nameEn:'Gold',       icon:'🟡', meltingPoint:1064, description:'最も価値の高い貴金属。腐食せず永遠に輝く。',                   color:'#fbbf24' },  
  copper:    { id:'copper',    name:'銅',         nameEn:'Copper',     icon:'🟤', meltingPoint:1085, description:'赤みがかった金属。電気の通りが良く配線材料として重要。',       color:'#b45309' },  
  nickel:    { id:'nickel',    name:'ニッケル',   nameEn:'Nickel',     icon:'🔘', meltingPoint:1455, description:'銀白色で硬い金属。合金・硬貨・めっきの材料として重要。',       color:'#9ca3af' },  
  iron:      { id:'iron',      name:'鉄',         nameEn:'Iron',       icon:'🔗', meltingPoint:1538, description:'最も一般的な金属。強くて安価で無数の用途がある。',             color:'#6b7280' },  
  titanium:  { id:'titanium',  name:'チタン',     nameEn:'Titanium',   icon:'🔵', meltingPoint:1668, description:'軽くて強い金属。航空機・医療機器・スポーツ用品に使われる。', color:'#60a5fa' },  
  
  /* ===== 追加10種 ===== */  
  bismuth:   { id:'bismuth',   name:'ビスマス',   nameEn:'Bismuth',    icon:'🌈', meltingPoint:271,  description:'七色に輝く結晶が美しい金属。低融点合金や医薬品に使われる。',   color:'#c4b5fd' },  
  indium:    { id:'indium',    name:'インジウム', nameEn:'Indium',     icon:'🔹', meltingPoint:157,  description:'柔らかい銀白色の金属。液晶ディスプレイのITO膜に不可欠。',     color:'#7dd3fc' },  
  magnesium: { id:'magnesium', name:'マグネシウム',nameEn:'Magnesium', icon:'✨', meltingPoint:650,  description:'非常に軽い金属。自動車や自転車フレームの軽量化に活躍。',       color:'#bbf7d0' },  
  manganese: { id:'manganese', name:'マンガン',   nameEn:'Manganese',  icon:'🟣', meltingPoint:1246, description:'鋼鉄の強度を高める合金元素。乾電池の電極にも使われる。',       color:'#e879f9' },  
  chromium:  { id:'chromium',  name:'クロム',     nameEn:'Chromium',   icon:'💠', meltingPoint:1907, description:'硬くて光沢のある金属。ステンレス鋼の主要成分で錆びない。',     color:'#38bdf8' },  
  cobalt:    { id:'cobalt',    name:'コバルト',   nameEn:'Cobalt',     icon:'🔮', meltingPoint:1495, description:'磁性を持つ青みがかった金属。リチウムイオン電池に重要。',       color:'#818cf8' },  
  molybdenum:{ id:'molybdenum',name:'モリブデン', nameEn:'Molybdenum', icon:'⚙️', meltingPoint:2623, description:'非常に高い融点を持つ金属。超高温環境の合金に使われる。',       color:'#94a3b8' },  
  tungsten:  { id:'tungsten',  name:'タングステン',nameEn:'Tungsten',  icon:'💡', meltingPoint:3422, description:'全金属中最高の融点。電球のフィラメントや超硬工具に使われる。', color:'#fef08a' },  
  platinum:  { id:'platinum',  name:'プラチナ',   nameEn:'Platinum',   icon:'🔶', meltingPoint:1768, description:'希少な白金族金属。触媒・宝飾品・医療機器に使われる高級金属。', color:'#e2e8f0' },  
  palladium: { id:'palladium', name:'パラジウム', nameEn:'Palladium',  icon:'🔸', meltingPoint:1555, description:'白金族の貴金属。自動車の排気触媒・歯科材料に不可欠。',         color:'#fcd34d' }  
};  

/* ============================================================
   難易度設定
   tempPerClick: 1クリックで上昇する温度（°C）
   coolRate:     自然冷却速度（°C/秒）
   ============================================================ */
const DIFFICULTY_SETTINGS = {
  realistic: {
    label: '現実的',
    description: '1クリックで +1°C（実際の送風をイメージ）',
    tempPerClick: 1,
    coolRate: 3.0,     // 冷却が速い
    baseTemp: 20,
    meltReward: 4      // 溶解成功時の入手個数
  },
  hard: {
    label: '難しい',
    description: '1クリックで +2°C（かなり大変）',
    tempPerClick: 2,
    coolRate: 1.5,
    baseTemp: 20,
    meltReward: 3      // 溶解成功時の入手個数
  },
  normal: {
    label: '普通',
    description: '1クリックで +5°C（ゲームとして楽しめる）',
    tempPerClick: 5,
    coolRate: 0.8,
    baseTemp: 20,
    meltReward: 2      // 溶解成功時の入手個数
  },
  easy: {
    label: '簡単',
    description: '1クリックで +12°C（サクサク進める）',
    tempPerClick: 12,
    coolRate: 0.3,
    baseTemp: 20,
    meltReward: 1      // 溶解成功時の入手個数
  }
};

/* ============================================================
   クラフトレシピ定義
   pattern: 3×3 グリッド（0=空、金属ID=素材）
   ingredientsSummary: 表示用素材リスト
   ============================================================ */
const RECIPES = [  
  
  /* ══════════════════════════════════════  
     【合金・素材】カテゴリ  14種  
     ══════════════════════════════════════ */  
  {  
    id:'bronze', name:'青銅', nameEn:'Bronze', icon:'🥉', category:'合金',  
    description:'銅とスズの合金。人類最初の合金金属。古代より武器・工具に使用。',  
    pattern:[['copper','tin',null],['tin','copper',null],[null,null,null]],  
    ingredients:{copper:2,tin:2}, ingredientsSummary:'銅×2 + スズ×2', rarity:'common'  
  },  
  {  
    id:'brass', name:'真鍮', nameEn:'Brass', icon:'🔔', category:'合金',  
    description:'銅と亜鉛の合金。金色の輝きを持ち楽器・装飾品に使われる。',  
    pattern:[['copper','zinc',null],['zinc','copper',null],[null,null,null]],  
    ingredients:{copper:2,zinc:2}, ingredientsSummary:'銅×2 + 亜鉛×2', rarity:'common'  
  },  
  {  
    id:'solder', name:'半田', nameEn:'Solder', icon:'🔌', category:'合金',  
    description:'スズと鉛の合金。融点が低く電子部品の接合に使われる。',  
    pattern:[['tin','lead',null],['lead','tin',null],[null,null,null]],  
    ingredients:{tin:2,lead:2}, ingredientsSummary:'スズ×2 + 鉛×2', rarity:'common'  
  },  
  {  
    id:'pewter', name:'ピューター', nameEn:'Pewter', icon:'🫙', category:'合金',  
    description:'スズを主成分にした合金。中世から食器・装飾品に使われた柔らかい金属。',  
    pattern:[['tin','tin','tin'],['tin','lead',null],[null,null,null]],  
    ingredients:{tin:4,lead:1}, ingredientsSummary:'スズ×4 + 鉛×1', rarity:'common'  
  },  
  {  
    id:'cupronickel', name:'白銅', nameEn:'Cupronickel', icon:'🪬', category:'合金',  
    description:'銅とニッケルの合金。硬貨に使われる耐食性の高い銀白色合金。',  
    pattern:[['copper','nickel',null],['nickel','copper',null],[null,null,null]],  
    ingredients:{copper:2,nickel:2}, ingredientsSummary:'銅×2 + ニッケル×2', rarity:'uncommon'  
  },  
  {  
    id:'steel', name:'鋼鉄', nameEn:'Steel', icon:'⚒️', category:'合金',  
    description:'鉄にマンガンを加えた強靭な合金鋼。建築・機械の基盤素材。',  
    pattern:[['iron','iron','iron'],['iron','manganese',null],[null,null,null]],  
    ingredients:{iron:4,manganese:1}, ingredientsSummary:'鉄×4 + マンガン×1', rarity:'uncommon'  
  },  
  {  
    id:'stainless', name:'ステンレス鋼', nameEn:'Stainless Steel', icon:'🔲', category:'合金',  
    description:'鉄・クロム・ニッケルの合金。錆びにくく衛生的で食器や医療器具に最適。',  
    pattern:[['iron','chromium','iron'],['chromium','nickel','chromium'],[null,null,null]],  
    ingredients:{iron:2,chromium:2,nickel:1}, ingredientsSummary:'鉄×2 + クロム×2 + ニッケル×1', rarity:'rare'  
  },  
  {  
    id:'nichrome', name:'ニクロム', nameEn:'Nichrome', icon:'🌡️', category:'合金',  
    description:'ニッケルとクロムの合金。電気抵抗が高く電熱ヒーターの線材として使われる。',  
    pattern:[['nickel','chromium','nickel'],[null,null,null],[null,null,null]],  
    ingredients:{nickel:2,chromium:1}, ingredientsSummary:'ニッケル×2 + クロム×1', rarity:'uncommon'  
  },  
  {  
    id:'alnico', name:'アルニコ磁石', nameEn:'Alnico Magnet', icon:'🧲', category:'合金',  
    description:'アルミ・ニッケル・コバルトの合金。強力な永久磁石として使われる。',  
    pattern:[['aluminum','nickel','cobalt'],[null,null,null],[null,null,null]],  
    ingredients:{aluminum:1,nickel:1,cobalt:1}, ingredientsSummary:'アルミ×1 + ニッケル×1 + コバルト×1', rarity:'rare'  
  },  
  {  
    id:'superalloy', name:'超合金', nameEn:'Superalloy', icon:'🛡️', category:'合金',  
    description:'ニッケル・コバルト・クロムの高性能合金。ジェットエンジンの高温部品に使われる。',  
    pattern:[['nickel','cobalt','chromium'],['cobalt','nickel','cobalt'],[null,null,null]],  
    ingredients:{nickel:2,cobalt:2,chromium:1}, ingredientsSummary:'ニッケル×2 + コバルト×2 + クロム×1', rarity:'epic'  
  },  
  {  
    id:'bismuth_alloy', name:'低融点合金', nameEn:'Fusible Alloy', icon:'🌡️', category:'合金',  
    description:'ビスマス・スズ・鉛の合金。70°C前後で溶ける特殊な低融点合金。',  
    pattern:[['bismuth','tin',null],['tin','lead',null],[null,null,null]],  
    ingredients:{bismuth:2,tin:1,lead:1}, ingredientsSummary:'ビスマス×2 + スズ×1 + 鉛×1', rarity:'uncommon'  
  },  
  {  
    id:'magnesium_alloy', name:'マグネシウム合金', nameEn:'Magnesium Alloy', icon:'🦴', category:'合金',  
    description:'マグネシウムとアルミの合金。航空機・自動車の軽量化に革命をもたらした。',  
    pattern:[['magnesium','aluminum',null],['aluminum','magnesium',null],[null,null,null]],  
    ingredients:{magnesium:2,aluminum:2}, ingredientsSummary:'マグネシウム×2 + アルミ×2', rarity:'uncommon'  
  },  
  {  
    id:'titanium_alloy', name:'チタン合金', nameEn:'Titanium Alloy', icon:'🚀', category:'合金',  
    description:'チタンとバナジウム族合金。宇宙船・戦闘機の機体に使われる究極の構造材。',  
    pattern:[['titanium','aluminum','titanium'],['aluminum','titanium',null],[null,null,null]],  
    ingredients:{titanium:3,aluminum:2}, ingredientsSummary:'チタン×3 + アルミ×2', rarity:'epic'  
  },  
  {  
    id:'platinum_alloy', name:'プラチナ合金', nameEn:'Platinum Alloy', icon:'💎', category:'合金',  
    description:'プラチナとパラジウムの合金。最高級宝飾品と精密計測器に使われる究極素材。',  
    pattern:[['platinum','palladium',null],['palladium','platinum',null],[null,null,null]],  
    ingredients:{platinum:2,palladium:2}, ingredientsSummary:'プラチナ×2 + パラジウム×2', rarity:'legendary'  
  },  
  
  /* ══════════════════════════════════════  
     【工具・武器】カテゴリ  12種  
     ══════════════════════════════════════ */  
  {  
    id:'iron_sword', name:'鉄の剣', nameEn:'Iron Sword', icon:'⚔️', category:'武器',  
    description:'鉄を打ち延ばして作った頑強な剣。古来より戦士の象徴として愛用された。',  
    pattern:[[null,'iron',null],[null,'iron',null],['iron','iron','iron']],  
    ingredients:{iron:5}, ingredientsSummary:'鉄×5', rarity:'uncommon'  
  },  
  {  
    id:'bronze_axe', name:'青銅の斧', nameEn:'Bronze Axe', icon:'🪓', category:'武器',  
    description:'青銅で作られた斧。人類が最初に使った金属製の斧。農耕・林業・戦争に活躍。',  
    pattern:[['bronze','bronze',null],['bronze','bronze',null],[null,'bronze',null]],  
    ingredients:{bronze:5}, ingredientsSummary:'青銅×5', rarity:'uncommon'  
  },  
  {  
    id:'steel_sword', name:'鋼の剣', nameEn:'Steel Sword', icon:'🗡️', category:'武器',  
    description:'鋼鉄で作られた名刀。鉄剣を凌駕する強靭さと切れ味を持つ。',  
    pattern:[[null,'steel',null],[null,'steel',null],['steel','steel','steel']],  
    ingredients:{steel:5}, ingredientsSummary:'鋼鉄×5', rarity:'rare'  
  },  
  {  
    id:'iron_pickaxe', name:'鉄のつるはし', nameEn:'Iron Pickaxe', icon:'⛏️', category:'工具',  
    description:'採掘用の鉄製つるはし。硬い岩盤を砕いて鉱石を掘り出す必需品。',  
    pattern:[['iron','iron','iron'],[null,'iron',null],[null,'iron',null]],  
    ingredients:{iron:3}, ingredientsSummary:'鉄×3', rarity:'common'  
  },  
  {  
    id:'copper_hammer', name:'銅のハンマー', nameEn:'Copper Hammer', icon:'🔨', category:'工具',  
    description:'銅製の作業ハンマー。火花を出さない性質から引火危険環境で使われる。',  
    pattern:[[null,null,null],['copper','copper','copper'],[null,'copper',null]],  
    ingredients:{copper:4}, ingredientsSummary:'銅×4', rarity:'common'  
  },  
  {  
    id:'titanium_tool', name:'チタン工具セット', nameEn:'Titanium Tool Set', icon:'🔧', category:'工具',  
    description:'チタン製の超軽量高強度工具セット。プロ用途の最高峰道具。',  
    pattern:[['titanium','titanium',null],[null,'titanium',null],[null,'titanium',null]],  
    ingredients:{titanium:4}, ingredientsSummary:'チタン×4', rarity:'epic'  
  },  
  {  
    id:'steel_shield', name:'鋼の盾', nameEn:'Steel Shield', icon:'🛡️', category:'武器',  
    description:'鋼鉄で鍛えた大型の盾。矢も剣も弾き返す防御の要。',  
    pattern:[['steel','steel','steel'],['steel','steel','steel'],[null,'steel',null]],  
    ingredients:{steel:7}, ingredientsSummary:'鋼鉄×7', rarity:'rare'  
  },  
  {  
    id:'nickel_wrench', name:'ニッケル製スパナ', nameEn:'Nickel Wrench', icon:'🔩', category:'工具',  
    description:'ニッケル合金製のスパナ。耐食性が高く水回り作業で重宝される。',  
    pattern:[[null,null,null],['nickel','nickel','nickel'],[null,null,null]],  
    ingredients:{nickel:3}, ingredientsSummary:'ニッケル×3', rarity:'common'  
  },  
  {  
    id:'tungsten_drill', name:'超硬ドリル', nameEn:'Tungsten Drill', icon:'🌀', category:'工具',  
    description:'タングステン製の超硬ドリルビット。最硬材料にも穴を開ける最強工具。',  
    pattern:[[null,'tungsten',null],[null,'tungsten',null],['tungsten',null,null]],  
    ingredients:{tungsten:3}, ingredientsSummary:'タングステン×3', rarity:'epic'  
  },  
  {  
    id:'platinum_scalpel', name:'プラチナメス', nameEn:'Platinum Scalpel', icon:'🔪', category:'工具',  
    description:'プラチナ製の医療用メス。生体適合性が高く最高級の外科手術器具。',  
    pattern:[[null,'platinum','platinum'],[null,'platinum',null],[null,null,null]],  
    ingredients:{platinum:3}, ingredientsSummary:'プラチナ×3', rarity:'legendary'  
  },  
  {  
    id:'lead_weight', name:'鉛の分銅', nameEn:'Lead Weight', icon:'⚖️', category:'工具',  
    description:'鉛で作られた測定用分銅。密度が高く小さくても重い精密測定器具。',  
    pattern:[['lead','lead','lead'],['lead','lead','lead'],[null,null,null]],  
    ingredients:{lead:6}, ingredientsSummary:'鉛×6', rarity:'common'  
  },  
  {  
    id:'zinc_trowel', name:'亜鉛こて', nameEn:'Zinc Trowel', icon:'🏗️', category:'工具',  
    description:'亜鉛めっき処理された左官こて。錆びにくく長寿命の建築工具。',  
    pattern:[['zinc','zinc','zinc'],[null,'zinc',null],[null,null,null]],  
    ingredients:{zinc:4}, ingredientsSummary:'亜鉛×4', rarity:'common'  
  },  
  
  /* ══════════════════════════════════════  
     【装飾・宝飾品】カテゴリ  10種  
     ══════════════════════════════════════ */  
  {  
    id:'silver_ring', name:'銀の指輪', nameEn:'Silver Ring', icon:'💍', category:'装飾',  
    description:'純銀で作られた美しい指輪。職人の技術が光る永遠の贈り物。',  
    pattern:[['silver','silver','silver'],['silver',null,'silver'],[null,null,null]],  
    ingredients:{silver:4}, ingredientsSummary:'銀×4', rarity:'rare'  
  },  
  {  
    id:'gold_crown', name:'黄金の王冠', nameEn:'Gold Crown', icon:'👑', category:'装飾',  
    description:'純金で作られた豪華な王冠。権力と富の象徴。職人の最高傑作。',  
    pattern:[['gold',null,'gold'],['gold','gold','gold'],['gold','gold','gold']],  
    ingredients:{gold:7}, ingredientsSummary:'金×7', rarity:'legendary'  
  },  
  {  
    id:'coin', name:'金貨', nameEn:'Gold Coin', icon:'🪙', category:'装飾',  
    description:'純金で作られた価値の高い金貨。古代より交易の基軸として使われた。',  
    pattern:[[null,'gold',null],['gold','gold','gold'],[null,'gold',null]],  
    ingredients:{gold:4}, ingredientsSummary:'金×4', rarity:'rare'  
  },  
  {  
    id:'silver_necklace', name:'銀のネックレス', nameEn:'Silver Necklace', icon:'📿', category:'装飾',  
    description:'銀で作られた優雅なネックレス。繊細な細工が美しく輝く。',  
    pattern:[['silver',null,'silver'],['silver','silver','silver'],[null,null,null]],  
    ingredients:{silver:5}, ingredientsSummary:'銀×5', rarity:'rare'  
  },  
  {  
    id:'bismuth_crystal', name:'ビスマス結晶', nameEn:'Bismuth Crystal', icon:'🔮', category:'装飾',  
    description:'ビスマスが冷却時に作る幾何学的な虹色結晶。自然界の芸術品。',  
    pattern:[[null,'bismuth',null],['bismuth','bismuth','bismuth'],[null,'bismuth',null]],  
    ingredients:{bismuth:4}, ingredientsSummary:'ビスマス×4', rarity:'uncommon'  
  },  
  {  
    id:'platinum_ring', name:'プラチナリング', nameEn:'Platinum Ring', icon:'💎', category:'装飾',  
    description:'最高級プラチナで作られた婚約指輪。永遠の絆を誓う証。',  
    pattern:[['platinum','platinum','platinum'],['platinum',null,'platinum'],[null,null,null]],  
    ingredients:{platinum:4}, ingredientsSummary:'プラチナ×4', rarity:'legendary'  
  },  
  {  
    id:'gold_bracelet', name:'金のブレスレット', nameEn:'Gold Bracelet', icon:'✨', category:'装飾',  
    description:'純金で作られたブレスレット。腕に纏う黄金の輝き。',  
    pattern:[['gold','gold','gold'],[null,null,null],[null,null,null]],  
    ingredients:{gold:3}, ingredientsSummary:'金×3', rarity:'uncommon'  
  },  
  {  
    id:'copper_statue', name:'銅像', nameEn:'Copper Statue', icon:'🗿', category:'装飾',  
    description:'銅で鋳造された像。時と共に緑青が付き風格が増す芸術作品。',  
    pattern:[['copper',null,'copper'],['copper','copper','copper'],['copper','copper','copper']],  
    ingredients:{copper:7}, ingredientsSummary:'銅×7', rarity:'rare'  
  },  
  {  
    id:'titanium_watch', name:'チタン時計ケース', nameEn:'Titanium Watch Case', icon:'⌚', category:'装飾',  
    description:'チタン製の腕時計ケース。軽量・耐傷・肌に優しい最高級時計の証。',  
    pattern:[['titanium',null,'titanium'],['titanium','titanium','titanium'],[null,null,null]],  
    ingredients:{titanium:5}, ingredientsSummary:'チタン×5', rarity:'epic'  
  },  
  {  
    id:'cobalt_gem', name:'コバルトブルー飾り石', nameEn:'Cobalt Blue Stone', icon:'💠', category:'装飾',  
    description:'コバルトを使った深い青色のガラス装飾品。古代から顔料として珍重された。',  
    pattern:[[null,'cobalt',null],['cobalt','cobalt','cobalt'],[null,'cobalt',null]],  
    ingredients:{cobalt:4}, ingredientsSummary:'コバルト×4', rarity:'uncommon'  
  },  
  
  /* ══════════════════════════════════════  
     【調理器具・食器】カテゴリ  8種  
     ══════════════════════════════════════ */  
  {  
    id:'iron_pot', name:'鉄鍋', nameEn:'Iron Pot', icon:'🍳', category:'調理器具',  
    description:'鋳鉄で作られた頑丈な鍋。熱伝導が均一で料理が美味しく仕上がる。',  
    pattern:[['iron',null,'iron'],['iron',null,'iron'],['iron','iron','iron']],  
    ingredients:{iron:7}, ingredientsSummary:'鉄×7', rarity:'uncommon'  
  },  
  {  
    id:'tin_plate', name:'スズ製皿', nameEn:'Tin Plate', icon:'🍽️', category:'食器',  
    description:'スズで作られた食器。軽くて錆びにくく古来より愛用されてきた。',  
    pattern:[['tin','tin','tin'],['tin',null,'tin'],['tin','tin','tin']],  
    ingredients:{tin:7}, ingredientsSummary:'スズ×7', rarity:'common'  
  },  
  {  
    id:'aluminum_foil', name:'アルミ箔', nameEn:'Aluminum Foil', icon:'📄', category:'日用品',  
    description:'アルミニウムを薄く伸ばした箔。食品の保存や調理に広く活躍。',  
    pattern:[['aluminum','aluminum','aluminum'],[null,null,null],[null,null,null]],  
    ingredients:{aluminum:3}, ingredientsSummary:'アルミ×3', rarity:'common'  
  },  
  {  
    id:'aluminum_can', name:'アルミ缶', nameEn:'Aluminum Can', icon:'🥤', category:'日用品',  
    description:'アルミニウムで作られた飲料缶。軽量でリサイクル率が高い。',  
    pattern:[['aluminum',null,'aluminum'],['aluminum',null,'aluminum'],[null,'aluminum',null]],  
    ingredients:{aluminum:5}, ingredientsSummary:'アルミ×5', rarity:'common'  
  },  
  {  
    id:'stainless_pot', name:'ステンレス鍋', nameEn:'Stainless Pot', icon:'🫕', category:'調理器具',  
    description:'ステンレス鋼で作られた鍋。錆びにくく衛生的で家庭料理の定番。',  
    pattern:[['stainless',null,'stainless'],['stainless',null,'stainless'],['stainless','stainless','stainless']],  
    ingredients:{stainless:7}, ingredientsSummary:'ステンレス鋼×7', rarity:'rare'  
  },  
  {  
    id:'copper_kettle', name:'銅製やかん', nameEn:'Copper Kettle', icon:'🫖', category:'調理器具',  
    description:'銅の高い熱伝導性を活かしたやかん。職人が手作りする伝統工芸品。',  
    pattern:[['copper','copper','copper'],['copper',null,'copper'],['copper','copper',null]],  
    ingredients:{copper:7}, ingredientsSummary:'銅×7', rarity:'uncommon'  
  },  
  {  
    id:'silver_spoon', name:'銀のスプーン', nameEn:'Silver Spoon', icon:'🥄', category:'食器',  
    description:'純銀で作られたスプーン。抗菌効果もあり高貴な食卓に欠かせない。',  
    pattern:[[null,'silver',null],[null,'silver',null],[null,'silver',null]],  
    ingredients:{silver:3}, ingredientsSummary:'銀×3', rarity:'uncommon'  
  },  
  {  
    id:'zinc_bucket', name:'亜鉛バケツ', nameEn:'Zinc Bucket', icon:'🪣', category:'日用品',  
    description:'亜鉛めっき鉄板で作られたバケツ。錆びにくく丈夫な実用品。',  
    pattern:[['zinc','zinc','zinc'],['zinc',null,'zinc'],['zinc','zinc','zinc']],  
    ingredients:{zinc:7}, ingredientsSummary:'亜鉛×7', rarity:'common'  
  },  
  
  /* ══════════════════════════════════════  
     【工業・電気・電子】カテゴリ  12種  
     ══════════════════════════════════════ */  
  {  
    id:'copper_wire', name:'銅線', nameEn:'Copper Wire', icon:'🔌', category:'工業',  
    description:'銅を細く引き延ばした電線。電気製品の配線に欠かせない基本素材。',  
    pattern:[['copper','copper','copper'],[null,null,null],[null,null,null]],  
    ingredients:{copper:3}, ingredientsSummary:'銅×3', rarity:'common'  
  },  
  {  
    id:'solder_joint', name:'電子基板', nameEn:'Circuit Board', icon:'🖥️', category:'電子',  
    description:'半田で部品を接合した電子回路基板。現代文明を支える心臓部。',  
    pattern:[['solder','copper','solder'],['copper','solder','copper'],[null,null,null]],  
    ingredients:{solder:3,copper:3}, ingredientsSummary:'半田×3 + 銅×3', rarity:'rare'  
  },  
  {  
    id:'nickel_alloy', name:'ニッケル合金板', nameEn:'Nickel Alloy Plate', icon:'🔳', category:'工業',  
    description:'ニッケルと鉄の合金板。耐熱・耐食性が高く工業部品に広く使われる。',  
    pattern:[['nickel','iron','nickel'],['iron','nickel','iron'],['nickel','iron','nickel']],  
    ingredients:{nickel:4,iron:4}, ingredientsSummary:'ニッケル×4 + 鉄×4', rarity:'rare'  
  },  
  {  
    id:'tungsten_filament', name:'タングステン電球', nameEn:'Tungsten Bulb', icon:'💡', category:'電気',  
    description:'タングステンフィラメントを使った白熱電球。3000°C以上で輝く光の源。',  
    pattern:[[null,'tungsten',null],['tungsten','tungsten','tungsten'],[null,'tungsten',null]],  
    ingredients:{tungsten:4}, ingredientsSummary:'タングステン×4', rarity:'rare'  
  },  
  {  
    id:'indium_panel', name:'液晶パネル素材', nameEn:'LCD Panel Material', icon:'📱', category:'電子',  
    description:'インジウム製のITO(酸化インジウムスズ)薄膜。スマートフォン画面の透明電極。',  
    pattern:[['indium','indium','indium'],['indium','tin','indium'],[null,null,null]],  
    ingredients:{indium:4,tin:1}, ingredientsSummary:'インジウム×4 + スズ×1', rarity:'epic'  
  },  
  {  
    id:'cobalt_battery', name:'コバルト電池', nameEn:'Cobalt Battery', icon:'🔋', category:'電子',  
    description:'コバルト酸リチウムを使ったリチウムイオン電池。スマホの電源を支える技術。',  
    pattern:[[null,'cobalt',null],['cobalt','cobalt','cobalt'],[null,'cobalt',null]],  
    ingredients:{cobalt:4}, ingredientsSummary:'コバルト×4', rarity:'rare'  
  },  
  {  
    id:'palladium_catalyst', name:'排気触媒', nameEn:'Exhaust Catalyst', icon:'🚗', category:'工業',  
    description:'パラジウムを使った自動車排気触媒。有害ガスを無害化し環境を守る。',  
    pattern:[['palladium','palladium','palladium'],[null,null,null],[null,null,null]],  
    ingredients:{palladium:3}, ingredientsSummary:'パラジウム×3', rarity:'epic'  
  },  
  {  
    id:'aluminum_frame', name:'アルミフレーム', nameEn:'Aluminum Frame', icon:'🚲', category:'工業',  
    description:'アルミ合金製の軽量フレーム。自転車・バイク・建材に広く使われる。',  
    pattern:[['aluminum','aluminum','aluminum'],['aluminum',null,'aluminum'],['aluminum','aluminum','aluminum']],  
    ingredients:{aluminum:7}, ingredientsSummary:'アルミ×7', rarity:'uncommon'  
  },  
  {  
    id:'molybdenum_shaft', name:'高温軸受け', nameEn:'High-Temp Bearing', icon:'⚙️', category:'工業',  
    description:'モリブデン製の耐熱軸受け。高温高圧環境でも変形しない工業部品。',  
    pattern:[[null,'molybdenum',null],['molybdenum','molybdenum','molybdenum'],[null,'molybdenum',null]],  
    ingredients:{molybdenum:4}, ingredientsSummary:'モリブデン×4', rarity:'epic'  
  },  
  {  
    id:'chromium_pipe', name:'クロムめっき管', nameEn:'Chrome Pipe', icon:'🪠', category:'工業',  
    description:'クロムでめっきされた鋼管。光沢があり錆びにくい配管・装飾用途に使われる。',  
    pattern:[['chromium','chromium','chromium'],[null,null,null],[null,null,null]],  
    ingredients:{chromium:3}, ingredientsSummary:'クロム×3', rarity:'uncommon'  
  },  
  {  
    id:'platinum_electrode', name:'プラチナ電極', nameEn:'Platinum Electrode', icon:'⚡', category:'電気',  
    description:'プラチナ製の電解槽電極。腐食しない安定した電気化学反応を実現。',  
    pattern:[['platinum','platinum','platinum'],[null,null,null],[null,null,null]],  
    ingredients:{platinum:3}, ingredientsSummary:'プラチナ×3', rarity:'legendary'  
  },  
  {  
    id:'magnesium_battery', name:'マグネシウム電池', nameEn:'Magnesium Battery', icon:'🪫', category:'電子',  
    description:'マグネシウムを負極とした次世代電池。軽量で大容量の未来の電源技術。',  
    pattern:[[null,'magnesium',null],['magnesium','magnesium','magnesium'],[null,null,null]],  
    ingredients:{magnesium:3}, ingredientsSummary:'マグネシウム×3', rarity:'rare'  
  },  
  
  /* ══════════════════════════════════════  
     【建材・容器・日用品】カテゴリ  8種  
     ══════════════════════════════════════ */  
  {  
    id:'lead_pipe', name:'鉛管', nameEn:'Lead Pipe', icon:'🪤', category:'建材',  
    description:'鉛で作られた水道管。古代ローマから使われてきた軟らかく加工しやすい配管。',  
    pattern:[['lead','lead','lead'],['lead','lead','lead'],[null,null,null]],  
    ingredients:{lead:6}, ingredientsSummary:'鉛×6', rarity:'common'  
  },  
  {  
    id:'zinc_roofing', name:'亜鉛屋根板', nameEn:'Zinc Roofing', icon:'🏠', category:'建材',  
    description:'亜鉛めっきした鋼板の屋根材。錆びにくく長期間建物を守る。',  
    pattern:[['zinc','zinc','zinc'],['zinc','zinc','zinc'],['zinc','zinc','zinc']],  
    ingredients:{zinc:9}, ingredientsSummary:'亜鉛×9', rarity:'uncommon'  
  },  
  {  
    id:'iron_gate', name:'鉄の門扉', nameEn:'Iron Gate', icon:'🚪', category:'建材',  
    description:'鉄で作られた重厚な門。城や屋敷の入口を守る堅固な構造物。',  
    pattern:[['iron','iron','iron'],['iron',null,'iron'],['iron','iron','iron']],  
    ingredients:{iron:8}, ingredientsSummary:'鉄×8', rarity:'uncommon'  
  },  
  {  
    id:'copper_roof', name:'銅板屋根', nameEn:'Copper Roof', icon:'⛩️', category:'建材',  
    description:'銅板を葺いた屋根。年月とともに緑青が生じ荘厳な佇まいになる。',  
    pattern:[['copper','copper','copper'],['copper','copper','copper'],[null,null,null]],  
    ingredients:{copper:6}, ingredientsSummary:'銅×6', rarity:'uncommon'  
  },  
  {  
    id:'aluminum_window', name:'アルミサッシ', nameEn:'Aluminum Sash', icon:'🪟', category:'建材',  
    description:'アルミ合金製の窓枠サッシ。軽量で耐食性が高く現代建築の標準部材。',  
    pattern:[['aluminum','aluminum','aluminum'],['aluminum',null,'aluminum'],['aluminum','aluminum','aluminum']],  
    ingredients:{aluminum:8}, ingredientsSummary:'アルミ×8', rarity:'uncommon'  
  },  
  {  
    id:'tin_can', name:'缶詰缶', nameEn:'Tin Can', icon:'🥫', category:'日用品',  
    description:'スズめっきした鋼製の缶詰容器。食品の長期保存を可能にした革命的な発明。',  
    pattern:[['tin',null,'tin'],['tin',null,'tin'],['tin','tin','tin']],  
    ingredients:{tin:6}, ingredientsSummary:'スズ×6', rarity:'common'  
  },  
  {  
    id:'lead_battery', name:'鉛蓄電池', nameEn:'Lead-Acid Battery', icon:'🔌', category:'電気',  
    description:'鉛と希硫酸を使った蓄電池。自動車のバッテリーとして世界中で使われる。',  
    pattern:[['lead','lead','lead'],['lead','lead','lead'],['lead','lead','lead']],  
    ingredients:{lead:9}, ingredientsSummary:'鉛×9', rarity:'uncommon'  
  },  
  {  
    id:'steel_beam', name:'H形鋼', nameEn:'H-Beam Steel', icon:'🏗️', category:'建材',  
    description:'H字断面の構造用鋼材。超高層ビルや橋梁の骨格を支える建設の要。',  
    pattern:[['steel','steel','steel'],['steel','steel','steel'],['steel','steel','steel']],  
    ingredients:{steel:9}, ingredientsSummary:'鋼鉄×9', rarity:'rare'  
  },  
  
  /* ══════════════════════════════════════  
     【乗り物・機械】カテゴリ  5種  
     ══════════════════════════════════════ */  
  {  
    id:'titanium_aircraft', name:'チタン機体部品', nameEn:'Titanium Aircraft Part', icon:'✈️', category:'乗り物',  
    description:'チタン合金で作られた航空機の胴体部品。軽量・高強度・耐熱の三拍子揃った究極部品。',  
    pattern:[['titanium_alloy','titanium_alloy','titanium_alloy'],['titanium',null,'titanium'],[null,null,null]],  
    ingredients:{titanium_alloy:3,titanium:2}, ingredientsSummary:'チタン合金×3 + チタン×2', rarity:'legendary'  
  },  
  {  
    id:'steel_gear', name:'鋼鉄歯車', nameEn:'Steel Gear', icon:'⚙️', category:'機械',  
    description:'鋼鉄で精密に作られた歯車。機械の動力を伝える重要な駆動部品。',  
    pattern:[[null,'steel',null],['steel','steel','steel'],[null,'steel',null]],  
    ingredients:{steel:4}, ingredientsSummary:'鋼鉄×4', rarity:'uncommon'  
  },  
  {  
    id:'copper_boiler', name:'銅製ボイラー', nameEn:'Copper Boiler', icon:'🫧', category:'機械',  
    description:'銅で作られた蒸気ボイラー。産業革命を牽引した蒸気機関の心臓部。',  
    pattern:[['copper','copper','copper'],['copper','copper','copper'],['copper',null,'copper']],  
    ingredients:{copper:8}, ingredientsSummary:'銅×8', rarity:'rare'  
  },  
  {  
    id:'superalloy_turbine', name:'タービンブレード', nameEn:'Turbine Blade', icon:'🌪️', category:'機械',  
    description:'超合金で作られたジェットエンジン用タービンブレード。1400°C超の環境で回転する。',  
    pattern:[['superalloy','superalloy',null],['superalloy','superalloy',null],[null,'superalloy',null]],  
    ingredients:{superalloy:5}, ingredientsSummary:'超合金×5', rarity:'legendary'  
  },  
  {  
    id:'molybdenum_engine', name:'耐熱エンジン部品', nameEn:'Heat-Resistant Engine Part', icon:'🏎️', category:'機械',  
    description:'モリブデン合金製のエンジン部品。高温高回転でも変形しないレーシング仕様。',  
    pattern:[['molybdenum','steel','molybdenum'],['steel','molybdenum','steel'],[null,null,null]],  
    ingredients:{molybdenum:3,steel:3}, ingredientsSummary:'モリブデン×3 + 鋼鉄×3', rarity:'epic'  
  },  
  
  /* ══════════════════════════════════════  
     【医療・科学・特殊】カテゴリ  5種  
     ══════════════════════════════════════ */  
  {  
    id:'titanium_implant', name:'チタン骨インプラント', nameEn:'Titanium Implant', icon:'🦾', category:'医療',  
    description:'チタン製の骨インプラント。生体適合性が高く人工関節・歯根に使われる。',  
    pattern:[[null,'titanium',null],['titanium','titanium','titanium'],[null,'titanium',null]],  
    ingredients:{titanium:4}, ingredientsSummary:'チタン×4', rarity:'epic'  
  },  
  {  
    id:'platinum_crucible', name:'プラチナるつぼ', nameEn:'Platinum Crucible', icon:'⚗️', category:'科学',  
    description:'プラチナ製の化学分析用るつぼ。腐食せず高温物質の精密分析を可能にする。',  
    pattern:[['platinum',null,'platinum'],['platinum',null,'platinum'],['platinum','platinum','platinum']],  
    ingredients:{platinum:7}, ingredientsSummary:'プラチナ×7', rarity:'legendary'  
  },  
  {  
    id:'magnesium_flare', name:'マグネシウム発炎筒', nameEn:'Magnesium Flare', icon:'🔦', category:'特殊',  
    description:'マグネシウムは燃焼時に強烈な白色光を発する。緊急信号・写真撮影に使われる。',  
    pattern:[[null,'magnesium',null],[null,'magnesium',null],[null,'magnesium',null]],  
    ingredients:{magnesium:3}, ingredientsSummary:'マグネシウム×3', rarity:'uncommon'  
  },  
  {  
    id:'nickel_coin', name:'硬貨', nameEn:'Coin', icon:'💰', category:'通貨',  
    description:'ニッケルと銅の合金でできた硬貨。現代の白銅貨。',  
    pattern:[[null,'cupronickel',null],['cupronickel','cupronickel','cupronickel'],[null,'cupronickel',null]],  
    ingredients:{cupronickel:4}, ingredientsSummary:'白銅×4', rarity:'uncommon'  
  },  
  {  
    id:'tungsten_armor', name:'タングステン装甲板', nameEn:'Tungsten Armor Plate', icon:'🛡️', category:'特殊',  
    description:'タングステン製の装甲板。戦車や核シェルターの放射線遮蔽壁に使われる最強の盾。',  
    pattern:[['tungsten','tungsten','tungsten'],['tungsten','tungsten','tungsten'],[null,null,null]],  
    ingredients:{tungsten:6}, ingredientsSummary:'タングステン×6', rarity:'legendary'  
  }  
];  

/* レアリティ設定 */
const RARITY_CONFIG = {
  common:    { label: 'コモン',     color: '#9ca3af', stars: '★' },
  uncommon:  { label: 'アンコモン', color: '#4ade80', stars: '★★' },
  rare:      { label: 'レア',       color: '#60a5fa', stars: '★★★' },
  epic:      { label: 'エピック',   color: '#a78bfa', stars: '★★★★' },
  legendary: { label: 'レジェンド', color: '#fbbf24', stars: '★★★★★' }
};
