const vscode = require('vscode');
const crypto = require('crypto');

function activate(context) {
  let view;
  let lastTyping = 0;
  const send = (type) => view?.webview.postMessage({ type });

  async function choose() {
    const files = await vscode.window.showOpenDialog({
      canSelectMany: false,
      filters: { '캐릭터 그림': ['png', 'jpg', 'jpeg', 'webp', 'gif'] },
      openLabel: '친구로 데려오기'
    });
    if (!files?.length) return;
    try {
      const bytes = await vscode.workspace.fs.readFile(files[0]);
      if (bytes.length > 8 * 1024 * 1024) {
        vscode.window.showWarningMessage('8MB 이하의 그림을 골라줘. 투명 PNG가 가장 잘 어울려!');
        return;
      }
      await vscode.workspace.fs.createDirectory(context.globalStorageUri);
      const ext = files[0].path.split('.').pop().toLowerCase();
      const stored = vscode.Uri.joinPath(context.globalStorageUri, `friend.${ext}`);
      await vscode.workspace.fs.writeFile(stored, bytes);
      await context.globalState.update('friend', stored.toString());
      if (view) await render();
    } catch (error) {
      vscode.window.showErrorMessage(`그림을 불러오지 못했어: ${error.message}`);
    }
  }

  async function render() {
    const webview = view.webview;
    const media = vscode.Uri.joinPath(context.extensionUri, 'media');
    let friend = vscode.Uri.joinPath(media, 'buddy.svg');
    const saved = context.globalState.get('friend');
    if (saved) {
      try {
        const uri = vscode.Uri.parse(saved);
        await vscode.workspace.fs.stat(uri);
        friend = uri;
      } catch { await context.globalState.update('friend', undefined); }
    }
    const asset = (uri) => webview.asWebviewUri(uri).toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    webview.html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <link rel="stylesheet" href="${asset(vscode.Uri.joinPath(media, 'room.css'))}"></head>
      <body><main><header><span class="dot"></span> 함께 코딩 중</header>
      <section class="room" aria-label="캐릭터의 작은 방"><div class="window"><span>✦</span></div>
      <p id="speech" role="status">여기서 같이 있을게.</p>
      <div class="walker" id="walker"><button id="pet" aria-label="친구 쓰다듬기"><img id="friend" src="${asset(friend)}" alt="내 낙서 친구" draggable="false"></button><div class="shadow"></div></div>
      <div class="floor"></div><span class="plant" aria-hidden="true">✿</span></section>
      <p class="hint">타이핑하면 꼬물 · 저장하면 폴짝<br>가만히 두면 쿨쿨</p>
      <button class="choose" id="choose">내 그림 데려오기</button>
      <button class="reset" id="reset">기본 친구</button>
      <p class="note">투명 PNG 추천 · 그림은 이 컴퓨터에만 저장돼요</p>
      </main><script nonce="${nonce}" src="${asset(vscode.Uri.joinPath(media, 'room.js'))}"></script></body></html>`;
  }

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('doodle-buddy.room', {
      async resolveWebviewView(resolved) {
        view = resolved;
        resolved.webview.options = {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media'), context.globalStorageUri]
        };
        resolved.onDidDispose(() => { if (view === resolved) view = undefined; }, null, context.subscriptions);
        resolved.webview.onDidReceiveMessage(async (message) => {
          if (message.type === 'choose') await choose();
          if (message.type === 'reset') {
            await context.globalState.update('friend', undefined);
            await render();
          }
        }, null, context.subscriptions);
        await render();
      }
    }),
    vscode.commands.registerCommand('doodle-buddy.choose', choose),
    vscode.commands.registerCommand('doodle-buddy.reset', async () => {
      await context.globalState.update('friend', undefined);
      if (view) await render();
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (!event.contentChanges.length || event.document !== vscode.window.activeTextEditor?.document) return;
      if (Date.now() - lastTyping < 650) return;
      lastTyping = Date.now();
      send('typing');
    }),
    vscode.workspace.onDidSaveTextDocument(() => send('save'))
  );
}
module.exports = { activate };
