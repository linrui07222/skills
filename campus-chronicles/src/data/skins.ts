export interface Skin {
  id: string;
  name: string;
  emoji: string;
  category: 'uniform' | 'shoes' | 'bag' | 'stationery' | 'seat' | 'weather' | 'bgm';
  description: string;
  cost: number; // in-game currency (achievement points)
}

export const skins: Skin[] = [
  // Uniforms
  { id: 'skin-default-uniform', name: '默认校服', emoji: '👔', category: 'uniform', description: '标准蓝色校服', cost: 0 },
  { id: 'skin-white-uniform', name: '白色校服', emoji: '🤍', category: 'uniform', description: '清爽白色校服', cost: 5 },
  { id: 'skin-black-uniform', name: '黑色校服', emoji: '🖤', category: 'uniform', description: '酷帅黑色校服', cost: 5 },
  // Shoes
  { id: 'skin-default-shoes', name: '默认球鞋', emoji: '👟', category: 'shoes', description: '普通运动鞋', cost: 0 },
  { id: 'skin-red-shoes', name: '红色跑鞋', emoji: '👟', category: 'shoes', description: '活力红色跑鞋', cost: 3 },
  // Bags
  { id: 'skin-default-bag', name: '默认书包', emoji: '🎒', category: 'bag', description: '普通双肩包', cost: 0 },
  { id: 'skin-cool-bag', name: '潮流背包', emoji: '🎒', category: 'bag', description: '时尚潮流背包', cost: 5 },
  // Weather
  { id: 'skin-sunny', name: '晴天', emoji: '☀️', category: 'weather', description: '阳光明媚', cost: 0 },
  { id: 'skin-sunset', name: '晚霞', emoji: '🌅', category: 'weather', description: '金色晚霞', cost: 8 },
  { id: 'skin-rain', name: '小雨', emoji: '🌧️', category: 'weather', description: '淅沥小雨', cost: 8 },
  { id: 'skin-fog', name: '晨雾', emoji: '🌫️', category: 'weather', description: '朦胧晨雾', cost: 10 },
  // BGM
  { id: 'skin-bgm-default', name: '默认BGM', emoji: '🎵', category: 'bgm', description: '校园日常', cost: 0 },
  { id: 'skin-bgm-piano', name: '钢琴曲', emoji: '🎹', category: 'bgm', description: '舒缓钢琴', cost: 10 },
  { id: 'skin-bgm-rock', name: '摇滚乐', emoji: '🎸', category: 'bgm', description: '热血摇滚', cost: 10 },
];
