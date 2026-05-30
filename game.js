/**
 * game.js - メインゲームロジック
 * モジュール: App（共通）/ Furnace（溶解炉）/ Craft（鍛造）/ Collection（コレクション）
 */

'use strict';

/* ============================================================
   セーブデータ管理
   localStorage を使用してゲーム状態を永続化
   ============================================================ */
const SaveData = {
  KEY: 'furnace_forge_save',

  /** セーブデータを読み込む（存在しなければ初期値） */
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaultData();
      return Object.assign(this.defaultData(), JSON.parse(raw));
    } catch (e) {
      // 読み込みエラー時は初期データを返す
      console.warn('[SaveData] 読み込みエラー:', e);
      return this.defaultData();
    }
  },

  /** セーブデータを書き込む */
  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      // ストレージが満杯などの場合
      App.toast('セーブに失敗しました。ブラウザのストレージを確認してください。', 'error');
      console.error('[SaveData] 書き込みエラー:', e);
    }
  },

  /** 初期データ構造 */
  defaultData() {
    return {
      version: 1,
      difficulty: 'normal',
      inventory: {},      // { metalId: quantity }
      collection: {},     // { recipeId: quantity }
      collectionNew: {},  // { recipeId: true } 未確認の新アイテム
      effects: true,
      totalMelts: 0,
      totalCrafts: 0
    };
  },

  /** データを完全リセット */
  reset() {
    localStorage.removeItem(this.KEY);
  }
};

/* ============================================================
   App - アプリケーション共通機能
   ============================================================ */
const App = {
  saveData: null,
  currentPage: 'furnace',
  effectsEnabled: true,

  /** 初期化 */
  init() {
    // セーブデータ読み込み
    this.saveData = SaveData.load();
    this.effectsEnabled = this.saveData.effects !== false;

    // UI初期化
    Furnace.init();
    Craft.init();
    Collection.init();

    // バッジ更新
    this.updateBadges();

    // 難易度を反映
    this.setDifficulty(this.saveData.difficulty, true);

    // ローディング終了
    this.finishLoading();
  },

  /** ローディングアニメーション完了後にアプリを表示 */
  finishLoading() {
    setTimeout(() => {
      const ls = document.getElementById('loading-screen');
      const app = document.getElementById('app');
      ls.classList.add('fade-out');
      app.style.display = 'flex';
      app.style.flexDirection = 'column';
      // ローディング要素を完全に除去
      setTimeout(() => { ls.style.display = 'none'; }, 700);
    }, 1600);
  },

  /** ページ遷移 */
  navigateTo(pageId) {
    // 全ページ非アクティブ
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // 対象ページをアクティブ
    const page = document.getElementById(`page-${pageId}`);
    if (!page) return;
    page.classList.add('active');

    const navBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (navBtn) navBtn.classList.add('active');

    this.currentPage = pageId;

    // ページ固有の初期化
    if (pageId === 'inventory') Inventory.render();
    if (pageId === 'craft') Craft.render();
    if (pageId === 'collection') Collection.render();
  },

  /** 難易度変更 */
  setDifficulty(diffId, silent = false) {
    if (!DIFFICULTY_SETTINGS[diffId]) return;

    this.saveData.difficulty = diffId;
    SaveData.save(this.saveData);

    // ボタン状態更新
    document.querySelectorAll('.diff-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.diff === diffId);
    });

    // 設定モーダルのセレクトボックスも更新
    const sel = document.getElementById('settings-difficulty');
    if (sel) sel.value = diffId;

    // 説明文更新
    const cfg = DIFFICULTY_SETTINGS[diffId];
    const descEl = document.getElementById('diff-desc');
    if (descEl) descEl.textContent = cfg.description;

    // 炉の温度上昇値表示更新
    const tpcEl = document.getElementById('temp-per-click');
    if (tpcEl) tpcEl.textContent = `+${cfg.tempPerClick}°C`;

    // Furnaceへ難易度反映
    Furnace.applyDifficulty(diffId);

    if (!silent) {
      this.toast(`難易度を「${cfg.label}」に変更しました`, 'info');
    }
  },

  /** 設定モーダル開閉 */
  openSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
  },
  closeSettings(event) {
    if (!event || event.target === document.getElementById('settings-modal')) {
      document.getElementById('settings-modal').classList.add('hidden');
    }
  },

  /** エフェクト切り替え */
  toggleEffects(enabled) {
    this.effectsEnabled = enabled;
    this.saveData.effects = enabled;
    SaveData.save(this.saveData);
  },

  /** ゲームリセット */
  resetGame() {
    if (!confirm('⚠️ 全てのデータ（素材・コレクション）が消えます。\nリセットしますか？')) return;
    SaveData.reset();
    location.reload();
  },

  /** アイテム詳細モーダルを開く */
  openItemModal(title, bodyHTML) {
    document.getElementById('item-modal-title').textContent = title;
    document.getElementById('item-modal-body').innerHTML = bodyHTML;
    document.getElementById('item-modal').classList.remove('hidden');
  },
  closeItemModal(event) {
    if (!event || event.target === document.getElementById('item-modal')) {
      document.getElementById('item-modal').classList.add('hidden');
    }
  },

  /** バッジ（件数）更新 */
  updateBadges() {
    // インベントリ：種類数
    const invCount = Object.values(this.saveData.inventory).filter(q => q > 0).length;
    const invBadge = document.getElementById('inventory-badge');
    if (invBadge) {
      invBadge.textContent = invCount;
      invBadge.classList.toggle('visible', invCount > 0);
    }

    // コレクション：新着件数
    const newCount = Object.keys(this.saveData.collectionNew || {}).length;
    const collBadge = document.getElementById('collection-badge');
    if (collBadge) {
      collBadge.textContent = newCount || Object.keys(this.saveData.collection).length;
      collBadge.classList.toggle('visible',
        (Object.keys(this.saveData.collection).length > 0) || newCount > 0
      );
    }
  },

  /** トースト通知表示
   * @param {string} msg  メッセージ
   * @param {string} type info|success|warning|error
   */
  toast(msg, type = 'info') {
    const ICONS = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="toast-icon">${ICONS[type]}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(el);

    // 自動で消える
    setTimeout(() => {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 350);
    }, 3200);
  },

  /** スパークエフェクト（クリック位置に火花） */
  spawnSparks(x, y) {
    if (!this.effectsEnabled) return;
    for (let i = 0; i < 5; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      spark.style.left = `${x}px`;
      spark.style.top  = `${y}px`;
      spark.style.setProperty('--dx', `translate(${dx}px, ${dy}px)`);
      spark.style.background = `hsl(${20 + Math.random() * 40}, 100%, 60%)`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  },

  /** ★ 溶解成功フルスクリーンフラッシュ */
  spawnMeltFlash() {
    if (!this.effectsEnabled) return;
    const el = document.createElement('div');
    el.className = 'melt-flash-overlay';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  },

  /** ★ 溶解成功パーティクルバースト */
  spawnMeltParticles(cx, cy) {
    if (!this.effectsEnabled) return;
    const COUNT = 24;
    const COLORS = ['#ff4500','#ff7b00','#ffaa00','#ffe066','#fff'];
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'melt-particle';
      const size = 8 + Math.random() * 10;
      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.3;
      const dist  = 80 + Math.random() * 160;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - Math.random() * 80; // 少し上へ
      el.style.width  = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left   = `${cx}px`;
      el.style.top    = `${cy}px`;
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.setProperty('--dx', `translate(${dx}px, ${dy}px)`);
      el.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
      el.style.animationDelay   = `${Math.random() * 0.15}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1600);
    }
  }
};

/* ============================================================
   Furnace - 溶解炉ロジック
   ============================================================ */
const Furnace = {
  selectedMetal: null,   // 選択中の金属ID
  currentTemp: 20,       // 現在温度
  targetTemp: 0,         // 目標温度（選択金属の融点）
  clickCount: 0,         // 総クリック数
  tempPerClick: 5,       // 1クリックあたりの上昇温度
  coolRate: 0.8,         // 自然冷却速度（°C/秒）
  isMelted: false,       // 溶解完了フラグ
  coolInterval: null,    // 冷却タイマー
  MAX_TEMP: 2000,        // 温度計の最大値

  /** 初期化 */
  init() {
    this.renderMetalList();
    this.applyDifficulty(App.saveData.difficulty);
    this.startCoolTimer();
    this.updateTempDisplay();
  },

  /** 金属一覧を描画 */
  renderMetalList() {
    const container = document.getElementById('metal-list');
    if (!container) return;
    container.innerHTML = '';

    Object.values(METALS).forEach(metal => {
      const stock = App.saveData.inventory[metal.id] || 0;
      const item = document.createElement('div');
      item.className = 'metal-item';
      item.id = `metal-item-${metal.id}`;
      item.innerHTML = `
        <span class="metal-icon">${metal.icon}</span>
        <div class="metal-info">
          <div class="metal-name">${metal.name}</div>
          <div class="metal-mp">融点: ${metal.meltingPoint}°C</div>
        </div>
        <span class="metal-stock ${stock > 0 ? 'has-stock' : ''}">${stock > 0 ? `×${stock}` : '0'}</span>
      `;
      item.addEventListener('click', () => this.selectMetal(metal.id));
      container.appendChild(item);
    });
  },

  /** 金属を選択 */
  selectMetal(metalId) {
    if (this.isMelted && this.selectedMetal === metalId) return;

    // 炉が高温なら選択変更を警告
    if (this.currentTemp > 100) {
      if (!confirm(`炉の温度が ${Math.round(this.currentTemp)}°C あります。\n金属を変えると冷却します。続けますか？`)) {
        return;
      }
      this.coolDown();
    }

    this.selectedMetal = metalId;
    this.isMelted = false;
    this.clickCount = 0;
    this.updateClickStats();

    const metal = METALS[metalId];
    this.targetTemp = metal.meltingPoint;

    // UI更新
    document.querySelectorAll('.metal-item').forEach(el => el.classList.remove('selected'));
    const selEl = document.getElementById(`metal-item-${metalId}`);
    if (selEl) selEl.classList.add('selected');

    // 炉の表示更新
    document.getElementById('furnace-metal-icon').textContent = metal.icon;
    document.getElementById('furnace-metal-name').textContent = metal.name;
    document.getElementById('target-temp-info').textContent = `目標: ${metal.meltingPoint}°C`;

    // 温度計のターゲットマーカー位置
    const pct = Math.min((metal.meltingPoint / this.MAX_TEMP) * 100, 100);
    const markEl = document.getElementById('thermo-target-mark');
    if (markEl) markEl.style.bottom = `${pct}%`;

    // タービン有効化
    const turbineBtn = document.getElementById('turbine-btn');
    if (turbineBtn) turbineBtn.classList.remove('disabled-turbine');

    // 溶解バナーを隠す
    document.getElementById('melt-success-banner').classList.add('hidden');

    // ステータス更新
    this.updateStatus(`${metal.name} を選択！融点は ${metal.meltingPoint}°C です。タービンを回して温度を上げよう！`);

    // 炉ビジュアルリセット
    this.updateFurnaceVisual();
  },

  /** タービンクリック処理 */
  clickTurbine() {
    if (!this.selectedMetal) {
      App.toast('まず溶かす金属を選んでください', 'warning');
      return;
    }
    if (this.isMelted) {
      App.toast(`${METALS[this.selectedMetal].name} はすでに溶解済みです！`, 'info');
      return;
    }

    // 温度上昇
    this.currentTemp = Math.min(this.currentTemp + this.tempPerClick, this.MAX_TEMP);
    this.clickCount++;

    // タービンアニメーション
    const visual = document.getElementById('turbine-visual');
    if (visual) {
      visual.style.transform = `rotate(${this.clickCount * 45}deg)`;
      visual.style.transition = '0.1s ease';
    }

    // スパークエフェクト
    const btn = document.getElementById('turbine-btn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      App.spawnSparks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // 風速（クリック数をm/sに換算）
    const windSpeed = Math.min(this.clickCount * 0.8, 30).toFixed(1);
    const windEl = document.getElementById('wind-speed');
    if (windEl) windEl.textContent = `${windSpeed} m/s`;

    this.updateClickStats();
    this.updateTempDisplay();
    this.updateFurnaceVisual();
    this.checkMeltCompletion();
  },

  /** 融点到達チェック */
  checkMeltCompletion() {
    if (!this.selectedMetal || this.isMelted) return;

    const metal = METALS[this.selectedMetal];
    if (this.currentTemp >= metal.meltingPoint) {
      this.completeMelt(metal);
    } else {
      // 進捗メッセージ
      const progress = Math.round((this.currentTemp / metal.meltingPoint) * 100);
      if (progress >= 80) {
        this.updateStatus(`🔥 もうすぐ！融点まであと ${Math.round(metal.meltingPoint - this.currentTemp)}°C！`);
      } else if (progress >= 50) {
        this.updateStatus(`⬆️ 温度上昇中... ${progress}% 到達`);
      } else {
        this.updateStatus(`💨 空気を送り続けよう... ${progress}%`);
      }
    }
  },

  /** 溶解完了処理 */
  completeMelt(metal) {
    this.isMelted = true;

    // 難易度に応じた入手個数を取得
    const diffCfg = DIFFICULTY_SETTINGS[App.saveData.difficulty] || DIFFICULTY_SETTINGS.normal;
    const reward = diffCfg.meltReward || 1;

    // インベントリに追加（難易度別個数）
    if (!App.saveData.inventory[metal.id]) {
      App.saveData.inventory[metal.id] = 0;
    }
    App.saveData.inventory[metal.id] += reward;
    App.saveData.totalMelts = (App.saveData.totalMelts || 0) + 1;
    SaveData.save(App.saveData);

    // 溶岩エフェクト（炉本体に溶岩を表示）
    const lava = document.getElementById('lava-container');
    if (lava) lava.style.height = '60%';

    const body = document.getElementById('furnace-body');
    if (body) body.classList.add('complete');

    // タービン無効化
    const turbineBtn = document.getElementById('turbine-btn');
    if (turbineBtn) turbineBtn.classList.add('disabled-turbine');

    // ★ フルスクリーンフラッシュエフェクト
    App.spawnMeltFlash();

    // ★ パーティクルバースト（炉の中心から）
    const furnaceBody = document.getElementById('furnace-body');
    if (furnaceBody) {
      const rect = furnaceBody.getBoundingClientRect();
      App.spawnMeltParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // 成功バナー表示（少し遅延してアニメをずらす）
    setTimeout(() => {
      const bannerEl = document.getElementById('melt-success-banner');
      if (bannerEl) {
        // 再アニメのためにクラスを一度外して付け直す
        bannerEl.classList.remove('hidden');
        void bannerEl.offsetWidth; // reflow
        bannerEl.style.animation = 'none';
        void bannerEl.offsetWidth;
        bannerEl.style.animation = '';
      }
      document.getElementById('banner-metal-name').textContent = metal.name;
      document.getElementById('banner-reward-qty').textContent = `×${reward} 個 素材庫に追加されました`;
    }, 150);

    // メタルリストの在庫更新
    this.renderMetalList();
    if (this.selectedMetal) {
      const selEl = document.getElementById(`metal-item-${this.selectedMetal}`);
      if (selEl) selEl.classList.add('selected');
    }

    // バッジ更新
    App.updateBadges();

    // ステータス
    this.updateStatus(`✨ ${metal.name} の溶解に成功！×${reward} 個が素材庫に追加されました。`);

    // 成功通知（大きく）
    App.toast(`🔥🔥 ${metal.name} の溶解成功！×${reward} 個が素材庫に追加されました 🔥🔥`, 'success');
  },

  /** 炉を冷却（リセット） */
  coolDown() {
    this.currentTemp = 20;
    this.isMelted = false;
    this.clickCount = 0;

    const visual = document.getElementById('turbine-visual');
    if (visual) { visual.style.transform = 'rotate(0deg)'; }

    const lava = document.getElementById('lava-container');
    if (lava) lava.style.height = '0';

    const body = document.getElementById('furnace-body');
    if (body) body.classList.remove('heating', 'melting', 'complete');

    const turbineBtn = document.getElementById('turbine-btn');
    if (turbineBtn) turbineBtn.classList.remove('disabled-turbine');

    document.getElementById('melt-success-banner').classList.add('hidden');

    this.updateTempDisplay();
    this.updateClickStats();
    this.updateStatus('❄️ 炉を冷却しました。また温めましょう！');
  },

  /** 自然冷却タイマー開始 */
  startCoolTimer() {
    // 既存タイマーをクリア
    if (this.coolInterval) clearInterval(this.coolInterval);

    this.coolInterval = setInterval(() => {
      if (this.currentTemp > 20 && !this.isMelted) {
        this.currentTemp = Math.max(20, this.currentTemp - this.coolRate);
        this.updateTempDisplay();
        this.updateFurnaceVisual();
      }
    }, 1000);
  },

  /** 難易度適用 */
  applyDifficulty(diffId) {
    const cfg = DIFFICULTY_SETTINGS[diffId] || DIFFICULTY_SETTINGS.normal;
    this.tempPerClick = cfg.tempPerClick;
    this.coolRate = cfg.coolRate;

    const tpcEl = document.getElementById('temp-per-click');
    if (tpcEl) tpcEl.textContent = `+${cfg.tempPerClick}°C`;

    const descEl = document.getElementById('diff-desc');
    if (descEl) descEl.textContent = cfg.description;

    // 冷却タイマーを再起動
    this.startCoolTimer();
  },

  /** 温度表示を更新 */
  updateTempDisplay() {
    const tempEl = document.getElementById('current-temp-display');
    if (tempEl) tempEl.textContent = Math.round(this.currentTemp);

    // 温度計フィル
    const pct = Math.min((this.currentTemp / this.MAX_TEMP) * 100, 100);
    const fillEl = document.getElementById('thermo-fill');
    if (fillEl) fillEl.style.height = `${pct}%`;
  },

  /** 炉のビジュアル状態を更新 */
  updateFurnaceVisual() {
    const body = document.getElementById('furnace-body');
    if (!body) return;

    const pct = this.targetTemp > 0
      ? Math.min((this.currentTemp / this.targetTemp) * 100, 100)
      : 0;

    body.classList.remove('heating', 'melting', 'complete');
    if (this.isMelted) {
      body.classList.add('complete');
    } else if (pct >= 85) {
      body.classList.add('melting');
    } else if (pct >= 20) {
      body.classList.add('heating');
    }

    // 溶岩レベル（50%以上から表示）
    const lava = document.getElementById('lava-container');
    if (lava && !this.isMelted) {
      const lavaHeight = pct >= 50 ? `${(pct - 50) * 2}%` : '0';
      lava.style.height = lavaHeight;
    }
  },

  /** クリック統計表示を更新 */
  updateClickStats() {
    const clickEl = document.getElementById('click-count');
    if (clickEl) clickEl.textContent = this.clickCount;
  },

  /** 状態メッセージを更新 */
  updateStatus(msg) {
    const el = document.getElementById('furnace-status');
    if (el) el.innerHTML = msg;
  }
};

/* ============================================================
   Inventory - 素材庫
   ============================================================ */
const Inventory = {
  /** 素材庫を描画 */
  render() {
    const grid = document.getElementById('inventory-grid');
    const empty = document.getElementById('inventory-empty');
    if (!grid || !empty) return;

    const inv = App.saveData.inventory;
    const items = Object.entries(inv).filter(([, qty]) => qty > 0);

    if (items.length === 0) {
      grid.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = '';

    items.forEach(([metalId, qty]) => {
      const metal = METALS[metalId];
      if (!metal) return;

      const card = document.createElement('div');
      card.className = 'inventory-card';
      card.innerHTML = `
        <span class="inv-icon">${metal.icon}</span>
        <div class="inv-name">${metal.name}</div>
        <span class="inv-qty">×${qty}</span>
      `;
      card.addEventListener('click', () => {
        App.openItemModal(`${metal.icon} ${metal.name}`, `
          <div class="item-detail-icon">${metal.icon}</div>
          <div class="item-detail-name">${metal.name}（${metal.nameEn}）</div>
          <div class="item-detail-desc">${metal.description}</div>
          <div class="item-detail-ingredients">
            <strong>詳細情報</strong>
            融点: ${metal.meltingPoint}°C<br>
            所持数: ${qty} 個
          </div>
        `);
      });
      grid.appendChild(card);
    });

    App.updateBadges();
  }
};

/* ============================================================
   Craft - 鍛造台ロジック
   ============================================================ */
const Craft = {
  /** クラフトグリッドの状態（9マス） */
  grid: Array(9).fill(null),  // null または metalId
  selectedRecipe: null,

  /** 初期化 */
  init() {
    this.renderGrid();
    this.renderRecipes();
  },

  /** 描画（ページ切り替え時に呼ばれる） */
  render() {
    this.renderRecipes();
    this.renderGrid();
    this.matchRecipe();
  },

  /** 3×3 クラフトグリッドを描画 */
  renderGrid() {
    const container = document.getElementById('craft-grid');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = `craft-cell ${this.grid[i] ? 'has-item' : ''}`;
      cell.dataset.index = i;

      if (this.grid[i]) {
        const metal = METALS[this.grid[i]];
        cell.innerHTML = `
          <span class="cell-icon">${metal ? metal.icon : '?'}</span>
          <span class="cell-name">${metal ? metal.name : '?'}</span>
          <button class="cell-clear" data-index="${i}" title="取り除く">×</button>
        `;
      } else {
        cell.innerHTML = `<span style="color:var(--text-dim);font-size:0.7rem;">空</span>`;
      }

      // セルクリック：空マスなら素材を配置
      cell.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell-clear')) {
          this.clearCell(parseInt(e.target.dataset.index));
        } else if (!this.grid[i]) {
          this.openMaterialPicker(i);
        }
      });

      container.appendChild(cell);
    }
  },

  /** 素材選択ピッカーをトースト的に表示 */
  openMaterialPicker(cellIndex) {
    const inv = App.saveData.inventory;
    const available = Object.entries(inv).filter(([, qty]) => qty > 0);

    if (available.length === 0) {
      App.toast('使える素材がありません。溶解炉で金属を溶かしましょう！', 'warning');
      return;
    }

    // 素材選択モーダルを使う
    let html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">';
    available.forEach(([metalId, qty]) => {
      const m = METALS[metalId];
      if (!m) return;
      html += `
        <button onclick="Craft.placeInCell(${cellIndex}, '${metalId}')"
          style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;
                 padding:10px 6px;cursor:pointer;text-align:center;color:var(--text-primary);
                 font-family:var(--font-main);transition:all 0.15s ease;"
          onmouseover="this.style.borderColor='var(--lava-mid)'"
          onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:1.6rem;margin-bottom:4px;">${m.icon}</div>
          <div style="font-size:0.78rem;font-weight:600;">${m.name}</div>
          <div style="font-size:0.7rem;color:var(--lava-warm);font-family:var(--font-mono);">×${qty}</div>
        </button>
      `;
    });
    html += '</div>';

    App.openItemModal('素材を選択（クリックで配置）', html);
  },

  /** セルに素材を配置 */
  placeInCell(cellIndex, metalId) {
    this.grid[cellIndex] = metalId;
    App.closeItemModal();
    this.renderGrid();
    this.matchRecipe();
  },

  /** セルをクリア */
  clearCell(cellIndex) {
    this.grid[cellIndex] = null;
    this.renderGrid();
    this.matchRecipe();
  },

  /** グリッド全体をクリア */
  clearGrid() {
    this.grid = Array(9).fill(null);
    this.renderGrid();
    this.matchRecipe();
  },

  /** レシピ一覧を描画 */
  renderRecipes() {
    const container = document.getElementById('recipe-list');
    if (!container) return;
    container.innerHTML = '';

    RECIPES.forEach(recipe => {
      const canCraft = this.canCraftRecipe(recipe);
      const item = document.createElement('div');
      item.className = `recipe-item ${canCraft ? 'can-craft' : ''} ${this.selectedRecipe === recipe.id ? 'selected' : ''}`;

      item.innerHTML = `
        <div class="recipe-header">
          <span class="recipe-result-icon">${recipe.icon}</span>
          <span class="recipe-result-name">${recipe.name}</span>
          <span class="recipe-status ${canCraft ? 'can' : ''}">${canCraft ? '作成可' : '素材不足'}</span>
        </div>
        <div class="recipe-ingredients">${recipe.ingredientsSummary}</div>
      `;

      item.addEventListener('click', () => this.selectRecipe(recipe.id));
      container.appendChild(item);
    });
  },

  /** レシピを選択してグリッドに自動配置 */
  selectRecipe(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    this.selectedRecipe = recipeId;

    // グリッドにパターンを自動配置
    const flat = recipe.pattern.flat();
    this.grid = flat.map(cell => cell || null);
    this.renderGrid();
    this.matchRecipe();

    // ヒント表示
    const hintEl = document.getElementById('craft-hint');
    if (hintEl) {
      hintEl.textContent = `レシピ「${recipe.name}」を配置しました。素材が足りない場合は確認してください。`;
    }

    this.renderRecipes(); // 選択状態を反映
  },

  /** グリッドのパターンがレシピと一致するか確認 */
  matchRecipe() {
    const resultSlot = document.getElementById('result-slot');
    const execBtn = document.getElementById('craft-execute-btn');
    const hintEl = document.getElementById('craft-hint');
    if (!resultSlot || !execBtn) return;

    // 空グリッドなら結果をリセット
    const hasAny = this.grid.some(c => c !== null);
    if (!hasAny) {
      resultSlot.innerHTML = '<span class="result-placeholder">？</span>';
      resultSlot.classList.remove('has-result');
      execBtn.disabled = true;
      if (hintEl) hintEl.textContent = 'レシピを選ぶか、グリッドに素材を配置してください';
      return;
    }

    // レシピと照合
    const matched = RECIPES.find(r => this.gridMatchesRecipe(r));

    if (matched) {
      // 素材が実際に足りるか確認
      if (!this.canCraftRecipe(matched)) {
        resultSlot.innerHTML = `<span style="font-size:1.6rem;">🔒</span>`;
        resultSlot.classList.remove('has-result');
        execBtn.disabled = true;
        if (hintEl) hintEl.textContent = `「${matched.name}」のレシピですが素材が足りません！`;
        return;
      }

      resultSlot.innerHTML = `<span style="font-size:2rem;">${matched.icon}</span>`;
      resultSlot.classList.add('has-result');
      execBtn.disabled = false;
      if (hintEl) hintEl.textContent = `「${matched.name}」が作れます！ボタンを押して作成しよう`;
    } else {
      resultSlot.innerHTML = '<span class="result-placeholder">？</span>';
      resultSlot.classList.remove('has-result');
      execBtn.disabled = true;
      if (hintEl) hintEl.textContent = 'レシピが一致しません。別の配置を試してみよう';
    }
  },

  /** グリッドとレシピのパターンが一致するか（回転・反転なし） */
  gridMatchesRecipe(recipe) {
    const flat = recipe.pattern.flat();
    if (flat.length !== 9) return false;
    for (let i = 0; i < 9; i++) {
      const recipeCell = flat[i] || null;
      const gridCell = this.grid[i] || null;
      if (recipeCell !== gridCell) return false;
    }
    return true;
  },

  /** 素材が足りるか確認 */
  canCraftRecipe(recipe) {
    const inv = App.saveData.inventory;
    // 必要素材の集計
    const needed = {};
    recipe.pattern.flat().forEach(cell => {
      if (cell) needed[cell] = (needed[cell] || 0) + 1;
    });
    // インベントリと照合
    return Object.entries(needed).every(([metalId, qty]) => {
      return (inv[metalId] || 0) >= qty;
    });
  },

  /** クラフト実行 */
  execute() {
    const matched = RECIPES.find(r => this.gridMatchesRecipe(r));
    if (!matched) {
      App.toast('レシピが一致しません', 'warning');
      return;
    }
    if (!this.canCraftRecipe(matched)) {
      App.toast('素材が足りません！', 'error');
      return;
    }

    // 素材を消費
    const needed = {};
    matched.pattern.flat().forEach(cell => {
      if (cell) needed[cell] = (needed[cell] || 0) + 1;
    });
    Object.entries(needed).forEach(([metalId, qty]) => {
      App.saveData.inventory[metalId] = (App.saveData.inventory[metalId] || 0) - qty;
      if (App.saveData.inventory[metalId] <= 0) {
        delete App.saveData.inventory[metalId];
      }
    });

    // コレクションに追加
    if (!App.saveData.collection[matched.id]) {
      App.saveData.collection[matched.id] = 0;
    }
    App.saveData.collection[matched.id]++;
    App.saveData.collectionNew = App.saveData.collectionNew || {};
    App.saveData.collectionNew[matched.id] = true;
    App.saveData.totalCrafts = (App.saveData.totalCrafts || 0) + 1;
    SaveData.save(App.saveData);

    // グリッドをクリア
    this.clearGrid();
    this.selectedRecipe = null;

    // UI更新
    this.renderRecipes();
    App.updateBadges();

    // 成功メッセージ
    App.toast(`🔨 「${matched.name}」を作成しました！コレクションに追加されました`, 'success');

    // コレクションへ誘導
    setTimeout(() => {
      if (confirm(`「${matched.icon} ${matched.name}」の作成に成功！\nコレクションページで確認しますか？`)) {
        App.navigateTo('collection');
      }
    }, 400);
  }
};

/* ============================================================
   Collection - コレクション管理
   ============================================================ */
const Collection = {
  /** 初期化（ページ遷移不要時） */
  init() {
    // バッジ更新のみ
    App.updateBadges();
  },

  /** コレクションページを描画 */
  render() {
    const grid = document.getElementById('collection-grid');
    const empty = document.getElementById('collection-empty');
    if (!grid || !empty) return;

    const coll = App.saveData.collection || {};
    const items = Object.entries(coll).filter(([, qty]) => qty > 0);

    if (items.length === 0) {
      grid.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = '';

    items.forEach(([recipeId, qty]) => {
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

      const isNew = App.saveData.collectionNew && App.saveData.collectionNew[recipeId];
      const rarity = RARITY_CONFIG[recipe.rarity] || RARITY_CONFIG.common;

      const card = document.createElement('div');
      card.className = 'collection-card';
      card.style.borderColor = rarity.color + '44';

      card.innerHTML = `
        ${isNew ? '<span class="coll-new-badge">NEW</span>' : ''}
        <span class="coll-icon">${recipe.icon}</span>
        <div class="coll-name">${recipe.name}</div>
        <div class="coll-qty">×${qty}</div>
        <div style="font-size:0.7rem;color:${rarity.color};margin-top:4px;">${rarity.stars} ${rarity.label}</div>
      `;

      card.addEventListener('click', () => {
        // NEWフラグをクリア
        if (App.saveData.collectionNew) {
          delete App.saveData.collectionNew[recipeId];
          SaveData.save(App.saveData);
          App.updateBadges();
        }

        App.openItemModal(`${recipe.icon} ${recipe.name}`, `
          <div class="item-detail-icon">${recipe.icon}</div>
          <div class="item-detail-name">${recipe.name}（${recipe.nameEn}）</div>
          <div class="item-detail-desc">${recipe.description}</div>
          <div class="item-detail-ingredients">
            <strong>素材</strong>
            ${recipe.ingredientsSummary}<br>
            <strong style="margin-top:8px;display:block;">所持数</strong>
            ${qty} 個<br>
            <strong style="margin-top:8px;display:block;">レアリティ</strong>
            <span style="color:${rarity.color};">${rarity.stars} ${rarity.label}</span><br>
            <strong style="margin-top:8px;display:block;">カテゴリ</strong>
            ${recipe.category}
          </div>
        `);

        // カードからNEWバッジを除去（描画上）
        card.querySelector('.coll-new-badge')?.remove();
      });

      grid.appendChild(card);
    });

    // NEWフラグをクリア後バッジを更新
    App.updateBadges();
  }
};

/* ============================================================
   DOMContentLoaded - エントリーポイント
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  try {
    App.init();
  } catch (e) {
    // 致命的なエラーはアラートで通知
    console.error('[App] 初期化エラー:', e);
    alert(`ゲームの起動に失敗しました。\nページを再読み込みしてください。\n\nエラー: ${e.message}`);
  }
});
