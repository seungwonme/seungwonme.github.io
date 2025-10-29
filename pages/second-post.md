---
title: 'JavaScript 비동기 프로그래밍 완벽 가이드'
date: 2025-01-27
tags: ['JavaScript', '비동기', 'Promise', 'async/await', '프론트엔드']
category: 'Tutorial'
description: 'JavaScript에서 비동기 프로그래밍의 기초부터 고급 패턴까지 완벽하게 이해해보자'
---

# JavaScript 비동기 프로그래밍 완벽 가이드

현대 JavaScript 개발에서 비동기 프로그래밍은 필수적인 개념입니다. 이 글에서는 콜백 지옥부터 최신 async/await 패턴까지 모든 것을 다뤄보겠습니다.

## 📋 목차

1. [동기 vs 비동기](#동기-vs-비동기)
2. [콜백 함수의 문제점](#콜백-함수의-문제점)
3. [Promise의 등장](#promise의-등장)
4. [async/await의 마법](#asyncawait의-마법)
5. [에러 처리 전략](#에러-처리-전략)
6. [실전 예제](#실전-예제)

## 동기 vs 비동기

### 동기 코드

```javascript
console.log('시작');
const result = someSyncOperation();
console.log('결과:', result);
console.log('끝');
```

### 비동기 코드

```javascript
console.log('시작');
someAsyncOperation().then((result) => {
  console.log('결과:', result);
});
console.log('끝'); // 이게 먼저 실행됨!
```

## 콜백 함수의 문제점

### 콜백 지옥 (Callback Hell)

```javascript
getUser(
  userId,
  (user) => {
    getPosts(
      user.id,
      (posts) => {
        getComments(
          posts[0].id,
          (comments) => {
            // 더 이상 못 참아...
            console.log('댓글:', comments);
          },
          (error) => console.error('댓글 로드 실패:', error),
        );
      },
      (error) => console.error('포스트 로드 실패:', error),
    );
  },
  (error) => console.error('유저 로드 실패:', error),
);
```

**문제점:**

- 가독성이 떨어짐
- 에러 처리가 복잡함
- 디버깅이 어려움
- 유지보수가 힘듦

## Promise의 등장

### 기본 Promise 사용법

```javascript
const myPromise = new Promise((resolve, reject) => {
  // 비동기 작업 수행
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      resolve('성공!');
    } else {
      reject(new Error('실패!'));
    }
  }, 1000);
});

// Promise 사용
myPromise
  .then((result) => {
    console.log('결과:', result);
    return result.toUpperCase();
  })
  .then((upperResult) => {
    console.log('대문자:', upperResult);
  })
  .catch((error) => {
    console.error('에러:', error.message);
  })
  .finally(() => {
    console.log('항상 실행됨');
  });
```

### Promise 체이닝

```javascript
function getUser(id) {
  return fetch(`/api/users/${id}`).then((response) => response.json());
}

function getPosts(userId) {
  return fetch(`/api/posts?userId=${userId}`).then((response) =>
    response.json(),
  );
}

getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => {
    console.log('사용자의 포스트들:', posts);
    return posts;
  })
  .then((posts) => posts.filter((post) => post.published))
  .then((publishedPosts) => {
    console.log('출판된 포스트들:', publishedPosts);
  })
  .catch((error) => console.error('에러:', error));
```

### Promise 정적 메서드

```javascript
// Promise.all - 모든 Promise가 완료될 때까지 기다림
Promise.all([fetch('/api/users'), fetch('/api/posts'), fetch('/api/comments')])
  .then(([users, posts, comments]) => {
    console.log('모든 데이터 로드 완료');
  })
  .catch((error) => console.error('하나라도 실패하면:', error));

// Promise.race - 가장 먼저 완료되는 Promise의 결과 반환
Promise.race([
  fetch('/api/fast-endpoint'),
  new Promise((resolve) => setTimeout(() => resolve('타임아웃'), 5000)),
]).then((result) => console.log('가장 빠른 결과:', result));

// Promise.allSettled - 모든 Promise가 완료될 때까지 기다리고 결과 반환
Promise.allSettled([
  fetch('/api/may-fail-1'),
  fetch('/api/may-fail-2'),
  fetch('/api/may-fail-3'),
]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`작업 ${index + 1} 성공:`, result.value);
    } else {
      console.log(`작업 ${index + 1} 실패:`, result.reason);
    }
  });
});
```

## async/await의 마법

### 기본 문법

```javascript
async function getUserData() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);

    return {
      user,
      posts,
      comments,
    };
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    throw error;
  }
}

// 사용
getUserData()
  .then((data) => console.log('데이터:', data))
  .catch((error) => console.error('에러:', error));
```

### 병렬 처리 최적화

```javascript
async function getUserDashboard(userId) {
  try {
    // 병렬로 데이터 로드 (Promise.all 사용)
    const [user, posts, comments] = await Promise.all([
      getUser(userId),
      getPosts(userId),
      getComments(userId),
    ]);

    return {
      user,
      posts,
      comments,
      totalPosts: posts.length,
      totalComments: comments.length,
    };
  } catch (error) {
    console.error('대시보드 로드 실패:', error);
    throw error;
  }
}
```

## 에러 처리 전략

### try/catch를 사용한 에러 처리

```javascript
async function robustDataLoader() {
  try {
    const user = await getUser(1);
    console.log('사용자 로드 성공');

    const posts = await getPosts(user.id);
    console.log('포스트 로드 성공');

    return { user, posts };
  } catch (error) {
    // 세부적인 에러 처리
    if (error.code === 'NETWORK_ERROR') {
      console.error('네트워크 연결을 확인해주세요');
      // 재시도 로직
      return retryOperation();
    } else if (error.code === 'NOT_FOUND') {
      console.error('데이터를 찾을 수 없습니다');
      return { user: null, posts: [] };
    } else {
      console.error('알 수 없는 에러:', error);
      throw error; // 다시 던지기
    }
  }
}
```

### 에러 경계 (Error Boundaries)

```javascript
class AsyncErrorBoundary {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async execute(operation, context = {}) {
    try {
      const result = await operation();
      this.retryCount = 0; // 성공하면 카운트 리셋
      return result;
    } catch (error) {
      console.error(
        `작업 실패 (${this.retryCount + 1}/${this.maxRetries}):`,
        error,
      );

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // 지수 백오프
        console.log(`${delay}ms 후 재시도...`);

        await this.delay(delay);
        return this.execute(operation, context);
      }

      // 최대 재시도 횟수 초과
      throw new Error(`최대 재시도 횟수를 초과했습니다: ${error.message}`);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## 실전 예제

### API 클라이언트 클래스

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.errorBoundary = new AsyncErrorBoundary();
  }

  async request(endpoint, options = {}) {
    return this.errorBoundary.execute(async () => {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    });
  }

  // CRUD 메서드들
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// 사용 예제
const api = new ApiClient('https://jsonplaceholder.typicode.com');

async function loadUserDashboard() {
  try {
    const [user, posts] = await Promise.all([
      api.get('/users/1'),
      api.get('/posts?userId=1'),
    ]);

    console.log('사용자:', user);
    console.log('포스트들:', posts);
  } catch (error) {
    console.error('대시보드 로드 실패:', error);
  }
}

loadUserDashboard();
```

## 🎯 결론

JavaScript 비동기 프로그래밍은 처음에는 복잡해 보이지만, Promise와 async/await를 잘 이해하고 사용하면 코드의 가독성과 유지보수성이 크게 향상됩니다.

**핵심 포인트:**

- 콜백 지옥을 피하고 Promise를 사용하세요
- async/await로 동기적인 코드 스타일을 유지하세요
- 적절한 에러 처리를 구현하세요
- Promise.all로 병렬 처리를 최적화하세요

더 궁금한 점이 있으시면 댓글로 물어보세요! 💬

---

**다음 글 예고:** "React Hooks와 함께하는 상태 관리" - 곧 업데이트됩니다! 🚀
