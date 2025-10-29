// 게시글 로더 - 마크다운 로딩 및 파싱
class PostLoader {
  constructor() {
    this.postContainer = document.getElementById('post-container');
    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const filename = urlParams.get('file');

    if (!filename) {
      this.showError('게시글 파일이 지정되지 않았습니다.');
      return;
    }

    this.loadPost(filename);
  }

  async loadPost(filename) {
    try {
      this.showLoading();

      // posts.json에서 게시글 정보 찾기
      const postsResponse = await fetch('../posts.json');
      if (!postsResponse.ok) {
        throw new Error('posts.json을 불러올 수 없습니다.');
      }

      const posts = await postsResponse.json();
      const postInfo = posts.find((post) => post.file === filename);

      if (!postInfo) {
        throw new Error('게시글 정보를 찾을 수 없습니다.');
      }

      // 마크다운 파일 로드
      const markdownResponse = await fetch(`../pages/${filename}`);
      if (!markdownResponse.ok) {
        throw new Error('마크다운 파일을 불러올 수 없습니다.');
      }

      const markdown = await markdownResponse.text();

      // 마크다운 파싱 및 렌더링
      this.renderPost(markdown, postInfo);

      // 코드 하이라이팅 적용
      this.applyCodeHighlighting();

      // Giscus 댓글 로드
      this.loadGiscus();
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      this.showError(error.message);
    }
  }

  renderPost(markdown, postInfo) {
    // Front Matter 파싱
    const { content, metadata } = this.parseFrontMatter(markdown);

    // HTML 변환
    const htmlContent = marked.parse(content);

    // 게시글 HTML 생성
    const postHtml = `
            <header class="post-header">
                <h1 class="post-title">${this.escapeHtml(
                  metadata.title || postInfo.title,
                )}</h1>
                <div class="post-meta">
                    <span class="post-date">${this.formatDate(
                      metadata.date || postInfo.date,
                    )}</span>
                    ${
                      metadata.category
                        ? `<span class="post-category"> • ${this.escapeHtml(
                            metadata.category,
                          )}</span>`
                        : ''
                    }
                    ${
                      metadata.description
                        ? `<p class="post-description">${this.escapeHtml(
                            metadata.description,
                          )}</p>`
                        : ''
                    }
                </div>
                ${
                  metadata.tags && metadata.tags.length > 0
                    ? `
                    <div class="post-tags">
                        ${metadata.tags
                          .map(
                            (tag) =>
                              `<span class="tag-button">${this.escapeHtml(
                                tag,
                              )}</span>`,
                          )
                          .join('')}
                    </div>
                `
                    : ''
                }
            </header>
            <div class="post-body">
                ${htmlContent}
            </div>
        `;

    this.postContainer.innerHTML = postHtml;
  }

  parseFrontMatter(markdown) {
    const frontMatterMatch = markdown.match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
    );

    if (!frontMatterMatch) {
      return { content: markdown, metadata: {} };
    }

    const frontMatter = frontMatterMatch[1];
    const content = frontMatterMatch[2];

    const metadata = {};
    const lines = frontMatter.split('\n');

    lines.forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(',')
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''));
          }
        }

        metadata[key] = value;
      }
    });

    return { content, metadata };
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  applyCodeHighlighting() {
    // Prism.js가 로드된 후 코드 하이라이팅 적용
    if (typeof Prism !== 'undefined') {
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }

  loadGiscus() {
    // Giscus 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;

    // Giscus 설정 (이 값들은 실제 Giscus 설정에 맞게 변경해야 합니다)
    script.setAttribute('data-repo', 'your-username/your-repo-name');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', this.getGiscusTheme());
    script.setAttribute('data-lang', 'ko');

    // 테마 변경 감지 및 Giscus 테마 업데이트
    const observer = new MutationObserver(() => {
      const newTheme = this.getGiscusTheme();
      const giscusFrame = document.querySelector('iframe.giscus-frame');
      if (giscusFrame) {
        const message = {
          setConfig: {
            theme: newTheme,
          },
        };
        giscusFrame.contentWindow.postMessage(
          { giscus: message },
          'https://giscus.app',
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    document.getElementById('giscus-thread').appendChild(script);
  }

  getGiscusTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';
  }

  showLoading() {
    this.postContainer.innerHTML =
      '<div class="loading">게시글을 불러오는 중...</div>';
  }

  showError(message) {
    this.postContainer.innerHTML = `<div class="error">${this.escapeHtml(
      message,
    )}</div>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM 로드 완료 시 포스트 로더 초기화
document.addEventListener('DOMContentLoaded', () => {
  new PostLoader();
});
