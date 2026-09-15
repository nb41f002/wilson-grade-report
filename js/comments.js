/**
 * 教師評語常用片語庫
 * [Name] 會自動替換為學生英文名
 */
window.COMMENT_BANK = [
  {
    category: "🏆 優異成就",
    comments: [
      "[Name] achieved a perfect score—wonderful work! She shows excellent understanding and works very carefully. Her effort is excellent. Keep it up!",
      "[Name] is a highly motivated, patient, attentive, and capable learner. She shows good concentration during lessons and has developed effective study habits.",
      "[Name] demonstrates exceptional comprehension and analytical thinking in every assignment. An outstanding role model in class!",
      "[Name] consistently produces work of the highest caliber. Her intellectual curiosity and precision are truly commendable."
    ]
  },
  {
    category: "🌱 成長進步",
    comments: [
      "[Name] has grown wonderfully this term. She is attentive, helpful, and her confidence in supporting both her own learning and that of her peers has strengthened noticeably.",
      "[Name] has made tremendous progress in vocabulary and comprehension. Her perseverance throughout the semester is inspiring.",
      "[Name] is developing into a more self-directed learner. Her confidence in presenting ideas before the class is shining through."
    ]
  },
  {
    category: "📚 態度與習慣",
    comments: [
      "[Name] is a little quiet sometimes, but her answers are almost all correct. She approaches every learning task with thorough care.",
      "[Name] displays exemplary work habits, maintains well-organized class notes, and always submits assignments punctually.",
      "[Name] participates actively in group activities and shows wonderful empathy and collaboration when teaming up with peers.",
      "[Name] listens attentively in class and follows instructions meticulously. Her positive attitude brightens our classroom."
    ]
  },
  {
    category: "💡 勉勵建議",
    comments: [
      "[Name] grasps key ideas very well. With just a little more courage to speak up during open class discussions, she will excel even further.",
      "[Name] is encouraged to review notes regularly and double-check written answers to ensure maximum accuracy.",
      "[Name] possesses great potential. Practicing reading aloud at home will build greater fluency and expression."
    ]
  },
  {
    category: "🇹🇼 中文評語",
    comments: [
      "文筆細膩流暢，詞彙運用生動自然，能深刻表達真實情感與觀察。",
      "課堂朗讀音調準確，樂於開口練習日常對話，表現可圈可點。",
      "對在地歷史與地理文化探究具濃厚興趣，小組討論時能積極分享觀點。",
      "課堂專注度高，主動參與互動，作業書寫工整詳實，學習態度值得嘉許。",
      "歌唱音準穩定，樂於開口練習，合唱時能與同學協調配合。"
    ]
  }
];

window.Comments = {
  replaceName(text, englishName, chineseName) {
    const name = (englishName && String(englishName).trim()) || (chineseName && String(chineseName).trim()) || 'Student';
    return String(text || '').replace(/\[Name\]/g, name);
  },

  renderBankHtml(englishName, chineseName) {
    return (window.COMMENT_BANK || []).map((cat) => {
      const items = cat.comments.map((c) => {
        const parsed = this.replaceName(c, englishName, chineseName);
        const escaped = parsed
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
        return `<button type="button" class="comment-item-btn" data-text="${encodeURIComponent(parsed)}">${escaped}</button>`;
      }).join('');
      return `<div class="comment-category-block"><div class="category-badge">${cat.category}</div><div class="comment-list">${items}</div></div>`;
    }).join('');
  }
};
