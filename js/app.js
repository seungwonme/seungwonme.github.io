// 메인 애플리케이션 로직
class BlogApp {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentTag = null;
    this.searchTerm = '';

    this.init();
  }

  async init() {
    try {
      await this.loadPosts();
      this.renderPosts();
      this.setupEventListeners();
      this.showLoading(false);
    } catch (error) {
      console.error('블로그 초기화 중 오류:', error);
      this.showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
  }

  async loadPosts() {
    this.showLoading(true);

    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.posts = await response.json();
      this.filteredPosts = [...this.posts];
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      throw error;
    }
  }

  renderPosts() {
    const postsList = document.getElementById('posts-list');
    const tagFilter = document.getElementById('tag-filter');

    if (!postsList) return;

    // 게시글 목록 렌더링
    postsList.innerHTML =
      this.filteredPosts.length > 0
        ? this.filteredPosts.map((post) => this.createPostCard(post)).join('')
        : '<div class="error">게시글이 없습니다.</div>';

    // 태그 필터 렌더링
    const allTags = this.getAllTags();
    tagFilter.innerHTML =
      allTags.length > 0
        ? '<button class="tag-button" data-tag="">전체</button>' +
          allTags
            .map(
              (tag) =>
                `<button class="tag-button" data-tag="${tag}">${tag}</button>`,
            )
            .join('')
        : '';

    // 태그 버튼 이벤트 리스너 설정
    tagFilter.querySelectorAll('.tag-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const tag = e.target.dataset.tag;
        this.filterByTag(tag);
      });
    });

    // 현재 선택된 태그 표시
    this.updateTagFilterUI();
  }

  createPostCard(post) {
    const date = new Date(post.date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const tags =
      post.tags && post.tags.length > 0
        ? `<div class="post-tags">${post.tags
            .map((tag) => `<span class="tag-button">${tag}</span>`)
            .join('')}</div>`
        : '';

    return `
            <article class="post-card fade-in">
                <h2 class="post-title">
                    <a href="post.html?file=${encodeURIComponent(
                      post.file,
                    )}">${this.escapeHtml(post.title)}</a>
                </h2>
                <div class="post-meta">
                    <span>${date}</span>
                    ${
                      post.category
                        ? `<span> • ${this.escapeHtml(post.category)}</span>`
                        : ''
                    }
                </div>
                <p class="post-excerpt">${this.escapeHtml(post.excerpt)}</p>
                ${tags}
            </article>
        `;
  }

  getAllTags() {
    const tagSet = new Set();
    this.posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }

  filterByTag(tag) {
    this.currentTag = tag || null;
    this.applyFilters();
  }

  searchPosts(term) {
    this.searchTerm = term.toLowerCase().trim();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPosts = this.posts.filter((post) => {
      // 태그 필터링
      if (
        this.currentTag &&
        (!post.tags || !post.tags.includes(this.currentTag))
      ) {
        return false;
      }

      // 검색어 필터링
      if (this.searchTerm) {
        const searchContent = `${post.title} ${post.excerpt} ${
          post.tags?.join(' ') || ''
        }`.toLowerCase();
        return searchContent.includes(this.searchTerm);
      }

      return true;
    });

    this.renderPosts();
  }

  updateTagFilterUI() {
    const tagButtons = document.querySelectorAll('#tag-filter .tag-button');
    tagButtons.forEach((button) => {
      const tag = button.dataset.tag;
      button.classList.toggle('active', tag === (this.currentTag || ''));
    });
  }

  setupEventListeners() {
    // 검색 입력 이벤트
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchPosts(e.target.value);
        }, 300);
      });
    }
  }

  showLoading(show) {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    if (show) {
      postsList.innerHTML =
        '<div class="loading">게시글을 불러오는 중...</div>';
    }
  }

  showError(message) {
    const postsList = document.getElementById('posts-list');
    if (postsList) {
      postsList.innerHTML = `<div class="error">${this.escapeHtml(
        message,
      )}</div>`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  new BlogApp();
});
