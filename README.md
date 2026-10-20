# Doodle Buddy · 낙서 친구

Your own drawing, keeping you company while you code.

![Doodle Buddy running in VS Code](https://raw.githubusercontent.com/heeyeon9578/doodle-buddy/main/media/screenshot.png)

Bring a PNG, JPG, WebP, or GIF into a tiny room in your VS Code sidebar. Your buddy wiggles while you type, jumps when you save, and falls asleep when things get quiet.

## Get started

1. Click **낙서 친구** (the cat icon) in the Activity Bar.
2. Try the included character, or click **내 그림 데려오기** to choose your own drawing.
3. Open a text file and start typing. Click your buddy to say hello.

Transparent PNG images work best. Images up to 8 MB are supported.

## A little company

- Typing makes your buddy wiggle.
- Saving a file makes it jump.
- Clicking your buddy wakes it and shows a short Korean message.
- After 45 seconds without interaction, it takes a nap.
- While awake, it wanders gently around its room.
- Reduced motion preferences are respected.

## 내 그림과 함께 코딩하기

왼쪽 고양이 아이콘을 누르고 **내 그림 데려오기**로 캐릭터를 골라주세요. 타이핑하면 꼬물, 저장하면 폴짝! 클릭하면 반응하고 가만히 두면 잠듭니다.

명령 팔레트에서도 **낙서 친구: 내 그림 불러오기**, **낙서 친구: 기본 친구로 돌아가기**를 실행할 수 있습니다.

## Privacy

No account, API key, or external service is required. This extension does not collect telemetry or send your drawing or source code to a server. Your selected image is copied into VS Code's local extension storage. Text-change events trigger animations; document text is not read.

## Current scope

Desktop VS Code only. The whole image is animated with transforms; individual limbs are not rigged. Your character lives in the sidebar room.

## Install from Marketplace

[Get Doodle Buddy for VS Code](https://marketplace.visualstudio.com/items?itemName=CHOIHEEYOUN.doodle-buddy)

## Development

Open this folder in VS Code and press F5 to launch an Extension Development Host. No dependency installation or build step is required. Run `npm run check` to check JavaScript syntax. See [DEVELOPMENT.md](DEVELOPMENT.md) for the local development guide.
