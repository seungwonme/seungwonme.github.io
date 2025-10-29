// 다크/라이트 모드 토글
class ThemeManager {
  constructor() {
    this.theme = this.getSavedTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
  }

  getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  getSavedTheme() {
    return localStorage.getItem('theme');
  }

  saveTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeToggleButton();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme(this.theme);
  }

  updateThemeToggleButton() {
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.textContent = this.theme === 'light' ? '🌙' : '☀️';
      button.setAttribute(
        'aria-label',
        this.theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환',
      );
    }
  }

  setupEventListeners() {
    // 테마 토글 버튼
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
      themeButton.addEventListener('click', () => this.toggleTheme());
    }

    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          // 사용자가 수동으로 설정하지 않은 경우에만 시스템 테마 따라가기
          if (!this.getSavedTheme()) {
            this.theme = e.matches ? 'dark' : 'light';
            this.applyTheme();
          }
        });
    }

    // 키보드 단축키 (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  // 현재 테마 반환 (다른 모듈에서 사용 가능)
  getCurrentTheme() {
    return this.theme;
  }
}

// DOM 로드 완료 시 테마 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
