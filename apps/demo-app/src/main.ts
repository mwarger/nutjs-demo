import { mouse, keyboard, Key, Window, getWindows } from '@nut-tree/nut-js';

async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>
): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }
  return undefined;
}

async function main() {
  const windows = await getWindows();

  // print titles
  for (const window of windows) {
    const title = await window.title;
    console.log(title);
  }

  // this approach grabs window titles and then does things with them
  // another alternative is to alt-tab through windows, grab the currently active window, and then do things with that

  // need to know more about robotjs currently does to know if this is comparable

  // find main.ts, click title bar to activate window, and restart the TS server
  // await performActionOnWindow(windows, 'main.ts', async (window) => {
  //   const region = await window.region;
  //   await mouse.setPosition({ x: region.left + 200, y: region.top + 10 });
  //   await mouse.leftClick();

  //   await keyboard.pressKey(Key.LeftSuper, Key.LeftShift, Key.P);
  //   await keyboard.releaseKey(Key.LeftSuper, Key.LeftShift, Key.P);
  //   await keyboard.type('restart ts');
  //   await keyboard.pressKey(Key.Enter);
  // });

  // this currently does not "await" correctly
  // need to figure out how to do things in sequence if necessary
  // find terminal, click title bar to activate window, and clear the terminal
  await performActionOnWindow(windows, 'figterm', async (window) => {
    const region = await window.region;
    await mouse.setPosition({ x: region.left + 200, y: region.top + 10 });
    await mouse.leftClick();

    await keyboard.type('so is this - hello from nutjs');
    await keyboard.pressKey(Key.Enter);
  });
}

main();

async function performActionOnWindow(
  windows: Window[],
  titleSearch: string | RegExp,
  action: (window: Window) => Promise<void>
) {
  const foundWindow = await findAsyncSequential(windows, async (window) => {
    const title = await window.title;

    // test if title contains titleSearch with regex
    return new RegExp(titleSearch).test(title);
  });

  console.log(foundWindow);
  if (foundWindow) {
    action(foundWindow);
  } else {
    console.log(`Could not find window with title ${titleSearch}`);
  }
}
