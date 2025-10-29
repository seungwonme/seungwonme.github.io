// 검색 기능 헬퍼 유틸리티
class SearchUtils {
  static normalizeText(text) {
    return text.toLowerCase().replace(/[가-힣]/g, (char) => {
      // 한글 자모 분리 (더 정확한 검색을 위해)
      const ga = 44032;
      const uni = char.charCodeAt(0);
      if (uni >= ga && uni < ga + 11172) {
        const fn = Math.floor((uni - ga) / 588);
        const mn = Math.floor((uni - ga - fn * 588) / 28);
        const ln = uni - ga - fn * 588 - mn * 28;
        return String.fromCharCode(
          fn + 4352,
          mn ? mn + 4449 : 0,
          ln ? ln + 4520 : 0,
        ).replace(/\0/g, '');
      }
      return char;
    });
  }

  static highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text;

    const normalizedText = this.normalizeText(text);
    const normalizedTerm = this.normalizeText(searchTerm);

    if (!normalizedText.includes(normalizedTerm)) return text;

    // 검색어 하이라이팅 (단순 구현)
    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static getSearchScore(text, searchTerm) {
    if (!searchTerm) return 0;

    const normalizedText = this.normalizeText(text);
    const normalizedTerm = this.normalizeText(searchTerm);

    // 제목에 검색어가 있는 경우 높은 점수
    if (normalizedText.includes(normalizedTerm)) {
      return 100;
    }

    // 본문에 검색어가 있는 경우 중간 점수
    const words = normalizedTerm.split(/\s+/);
    let score = 0;
    words.forEach((word) => {
      if (normalizedText.includes(word)) {
        score += 50;
      }
    });

    return Math.min(score, 99);
  }
}

// 전역에서 사용할 수 있도록 export
window.SearchUtils = SearchUtils;
