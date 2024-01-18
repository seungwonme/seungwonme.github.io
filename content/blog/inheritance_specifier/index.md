---
title: Inheritance Specifier
date: 2024-01-18 14:01:91
category: inheritance_specifier
thumbnail: { thumbnailSrc }
draft: false
---

# Inheritance Specifier

`private`, `protected`, `public` 순서로 접근의 범위가 넓어진다.

상속은 두 가지 규칙이 있다고 생각하면 된다.

1. Base Class의 `private`, `protected` 멤버들이 Derived Class의 멤버로 상속된다. (`private` 멤버는 상속되지 않는다.)
2. 상속 시 기술한 접근 지시 제어자보다 (Base Class에서) 범위가 넓은 접근 지시 제어자에 속해 있는 멤버들이 (Derived) 상속 시 기술한 접근 지시 제어자의 멤버로 속하게 된다.

```cpp
class Base {
public:
	int publicMember;
protected:
	int protectedMember;
private:
	int privateMember;
};

class DerivedPublic : public Base 
{
public:
	// publicMember
protected:
	// protectedMember
};

class DerivedProtected : protected Base 
{
protected:
	// publicMember
	// protectedMember
};

class DerivedPrivate : private Base {
private:
	// publicMember
	// protectedMember
};
```
