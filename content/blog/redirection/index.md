---
title: Redirection
date: "2023-12-26T01:46:37.121Z"
---

# Redirection

- [Redirection](#redirection)
	- [Redirecting stdout stream](#redirecting-stdout-stream)
		- [overwrite (\>)](#overwrite-)
		- [append (\>\>)](#append-)
		- [Example](#example)
			- [명령어의 결과를 file.txt에 남기기](#명령어의-결과를-filetxt에-남기기)
			- [특정 스크립트 실행 결과와 에러를 같은 파일에 남기기](#특정-스크립트-실행-결과와-에러를-같은-파일에-남기기)
			- [특정 스크립트 실행 결과와 에어를 분리해서 저장하기](#특정-스크립트-실행-결과와-에어를-분리해서-저장하기)
			- [stdout은 overwrite, stderr는 append하기](#stdout은-overwrite-stderr는-append하기)
		- [정리](#정리)
	- [stream이란](#stream이란)
	- [File Descriptor](#file-descriptor)
	- [Redirection](#redirection-1)
		- [기본 사용법](#기본-사용법)
		- [Default Value](#default-value)

## Redirecting stdout stream

- 데이터 흐름의 방향을 나타냄
- '>' 출력(overwrite)
- '>>' 출력(append)

### overwrite (>)

```shell
output > file.txt
```

- file.txt가 존재하지 않으면 새로 생성
- 이미 존재하면 덮어씌워짐

### append (>>)

```shell
output >> file.txt
```

- file.txt가 존재하지 않으면 새로 생성
- 이미 존재하면 기존의 내용 뒤에 덧

### Example

#### 명령어의 결과를 file.txt에 남기기

```shell
ls * > file.txt
```

- 표준 출력으로 출력되는 ls \*의 결과값을 파일에 저장

#### 특정 스크립트 실행 결과와 에러를 같은 파일에 남기기

```shell
test.sh > file.txt 2>&1
```

#### 특정 스크립트 실행 결과와 에어를 분리해서 저장하기

```shell
test.sh > file.txt 2> errfile.txt
```

#### stdout은 overwrite, stderr는 append하기

```shell
test.sh > file.txt 2>> errfile.txt
```

### 정리

- 프로그램의 stdin, stdout, stderr를 파일이나 다른 스트림으로 전달할 때 사용

## stream이란

- UNIX 이전의 OS에서는 명령어를 입력하고 출력을 보기 위해서는 프로그래머가 직접 입/출력장치를 설정해야 했다.
- 하지만 UNIX부터는 *data stream*이라는 개념을 이용하여 프로그래머가 어떤 장치를 사용하는 지와 관계없이 open, read, write를 할 수 있게 했다. 또한 자동으로 입/출력 장치를 연결하여 많은 부담을 덜게 되었다.

`stream` 이란 디스크 상의 파일이나 컴퓨터에 연결되는 여러 장치들을 통일된 방식으로 다루기 위한 가상적인 개념이다.
- 데이터가 어디서 나와서 어디로 가는 지 신경 쓸 필요없이 장치, 프로세스, 파일들과 연결되어 많은 편리성을 제공해준다.
- 프로세스가 생성되는 기본적으로 입출력을 위한 채널을 가지게 되는데, 이를 standard stream이라고 한다.

UNIX에서는 모든 장치를 파일로 관리한다.
즉, standard stream도 각각 `/dev/stdin` `/dev/stdout` `/dev/stderr`에 파일로 존재한다.

## File Descriptor

우리가 사용하는 파일들은 우리가 알아보기 쉬운 이름으로 보여지지만, 실제 프로그램 실행 시에는 FD라는 양의 정수 번호에 의해 처리가 된다.

| FD  | Description     |
| --- | --------------- |
| 0   | standard input  |
| 1   | standard output |
| 2   | standard error  |

- 운영체제는 프로세스에게 3개의 기본 FD를 할당한다.
- 프로세스가 내부적으로 다른 파일을 open하게 되면 FD(3, 4, 5 ...)를 할당한다.

## Redirection

FD에 할당된 번호를 프로그래머가 원하는 쪽으로 redirect하는 것

shell도 프로세스기 때문에 redirection을 할 때 이와 같은 FD 번호를 사용한다.

### 기본 사용법

```shell
$ cat infile
hello
world
$ wc 0< infile 1> outfile
$ cat outfile
  2  2 12
```
왼쪽에 FD, 오른쪽에는 FD나 파일의 이름을 위치시키면 된다.

### Default Value

위의 예시에서 infile을 FD 0(stdin)에 연결해서 입력으로 사용했고
FD 1(stdout)을 outfile에 연결하여 출력이 outfile에 저장되게 했다.
redirection 기호를 사용할 때 FD 번호를 적지 않으면 standard stream이 사용된다.
- < 의 좌
