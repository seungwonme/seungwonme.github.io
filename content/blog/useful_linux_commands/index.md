---
title: Useful Linux Commands
date: "2023-12-26T01:46:37.121Z"
---

# Useful Linux Commands

## File System

### cp

```shell
cp abc.txt def.txt #abc.txt 파일을 def.txt로 이름을 바꾸어 복사합니다.

cp abc.txt xyz
# xyz라는 디렉토리가 없다면 abc.txt 파일을 xyz 파일로 복사합니다.
# xyz라는 디렉토리가 있다면 xyz 디렉토리 안에 abc.txt 파일을 복사합니다.

cp abc.txt xyz/def.txt # abc.txt 파일을 xyz 디렉토리 안에 def.txt라는 이름으로 복사합니다.

cp -r abc xyz
# abc가 디렉토리이고 xyz라는 디렉토리가 없다면, abc 디렉토리를 xyz로 이름을 바꾸어 복사합니다.
# abc가 디렉토리이고 xyz라는 디렉토리가 있다면, abc 디렉토리를 xyz 디렉토리 안에 복사합니다. 즉 xyz/abc가 됩니다.

cp -r abc xyz/zzz
# abc가 디렉토리이고 xyz/zzz라는 디렉토리가 없다면, abc 디렉토리를 xyz 디렉토리 안에 zzz로 이름을 바꾸어서 복사합니다.
# abc가 디렉토리이고 xyz/zzz라는 디렉토리가 있다면, abc 디렉토리를 xyz/zzz 디렉토리 안에 복사합니다. 즉 xyz/zzz/abc가 됩니다.
```

### mv

```shell
mv abc.txt def.txt # abc.txt 파일을 def.txt로 이름을 바꾸어 이동, 파일 이름을 바꾸는 것과 결과가 같습니다.

mv abc.txt xyz
# xyz라는 디렉토리가 없다면 abc.txt 파일을 xyz로 이름을 바꾸어 이동합니다.
# xyz라는 디렉토리가 있다면 xyz 디렉토리 안으로 abc.txt 파일을 이동합니다.

mv abc.txt xyz/def.txt
# abc.txt 파일을 xyz 디렉토리 안으로 def.txt로 이름을 바꾸어 이동합니다.

mv abc xyz
# abc가 디렉토리이고 xyz라는 디렉토리가 없다면, abc 디렉토리를 xyz로 이름을 바꾸어 이동합니다.
# abc가 디렉토리이고 xyz라는 디렉토리가 있다면, abc 디렉토리를 xyz 디렉토리 안으로 이동합니다. 즉 xyz/abc가 됩니다.

mv abc xyz/zzz
# abc가 디렉토리이고 xyz/zzz라는 디렉토리가 없다면, abc 디렉토리를 xyz 디렉토리 안으로 zzz로 이름을 바꾸어 이동합니다.
# abc가 디렉토리이고 xyz/zzz라는 디렉토리가 있다면, abc 디렉토리를 xyz/zzz 디렉토리 안으로 이동합니다. 즉 xyz/zzz/abc가 됩니다.
```

### pbcopy

`pbcopy` 명령어는 표준 입력을 클립보드에 복사합니다.

```shell
echo "Hello World" | pbcopy
```

### pbpaste

`pbpaste` 명령어는 클립보드의 내용을 표준 출력으로 복사합니다.

```shell
pbpaste > hello.txt
```

## Network

### ifconfig

ifconfig | grep inet => ip address
ifconfig | grep ether => MAC address

- [a](https://blockdmask.tistory.com/509)
- [b](https://ss64.com/osx/ifconfig.html)

## Process

### ps

`ps aux | grep Z` 좀비 프로세스 잡기
- [ref](https://www.linode.com/docs/guides/use-the-ps-aux-command-in-linux/)

### lsof

`lsof` 명령어도 특정 포트를 사용하는 프로세스를 확인하는 데 사용

`sudo lsof -i :포트번호`

예를 들어, 포트 8080을 사용하는 프로세스를 확인하려면 다음과 같이 입력합니다:

`sudo lsof -i :8080`

`lsof` 명령어는 루트 권한이 필요할 수 있으므로 `sudo`를 사용하여 실행하는 것이 일반적입니다. 이 명령어는 해당 포트를 사용 중인 프로세스와 해당 프로세스의 세부 정보를 표시합니다.

이러한 명령어를 사용하여 특정 포트가 이미 사용 중인지 확인할 수 있습니다. 포트가 사용 중이면 관련된 프로세스 정보도 확인할 수 있습니다.

lsof -p [Process ID] => 열려있는 fd 확인
0u
1u
2u 는 디폴트
3...

### ulimit

프로세스의 리소스 제한 설정
ulimit -a

변경은 현재 세션에서만 반영되기 때문에 쉘 초기화 파일(.zshrc)에 해당 명령을 추가하면 된다.

### time

time [commend]
commend가 걸리는 시간 측정
