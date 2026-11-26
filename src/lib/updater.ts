import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { getVersion } from "@tauri-apps/api/app"
import { platform } from '@tauri-apps/plugin-os'; // Or check current platform
import { download } from '@tauri-apps/plugin-upload';
import { appCacheDir, BaseDirectory, join } from '@tauri-apps/api/path';
import { readTextFile, readDir, remove, exists } from '@tauri-apps/plugin-fs';
import {
  install,
  canInstall,
  requestInstallPermission,
} from "tauri-plugin-android-installer-api";


const REPO = "CouncilProjects/liars_quiz";

export async function handleUpdate(progressSetter: (a: number) => void) {
  const currentPlatform = platform();
  console.log(currentPlatform, await getVersion());
  if (['macos', 'windows', 'linux'].includes(currentPlatform)) {
    const update = await check();
    console.log("needs update : ", update);
    if (update) {
      console.log(
        `found update ${update.version} from ${update.date} with notes ${update.body}`
      );
      let downloaded = 0;
      let contentLength = 0;
      // alternatively we could also call update.download() and update.install() separately
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength || -1;
            console.log(`started downloading ${event.data.contentLength} bytes`);
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            progressSetter(downloaded / contentLength);
            break;
          case 'Finished':
            console.log('download finished');
            break;
        }
      });

      console.log('update installed');
      await relaunch();
    }
  } else if (['android'].includes(currentPlatform)) {
    const currentVersion = (await getVersion()).split('.').map(Number);

    try {
      await download(
        `https://github.com/${REPO}/releases/latest/download/latest.json`,
        await join(await appCacheDir(), "latest.json"),
        ({ progressTotal, total }) =>
          console.log(`Downloaded ${progressTotal} of ${total} bytes`), // a callback that will be called with the download progress
      );
    } catch (error) {
      if (typeof error == "string" && error.includes("404")) {
        console.log("No release taken");
      } else {
        console.error("Unknown error:", error);
      }

      return;
    }


    const latest = await JSON.parse(await readTextFile(await join(await appCacheDir(), 'latest.json')));
    let newestVersion = (latest.version as string).split('.').map(Number);
    if (newestVersion.length != 3) {
      console.warn("different versioning than expected");
    }
    let shouldGetNew = checkVersionNumber(currentVersion, newestVersion);

    if (shouldGetNew == false) {
      console.log("Clear old files");
      await removeLeftoverUpdateApk();
      return;
    }

    const path = await join(await appCacheDir(), `update-v${latest.version}.apk`);

    if (! await exists(path)) {
      try {
        await download(
          `https://github.com/${REPO}/releases/latest/download/tauritest_${latest.version}_universal.apk`,
          path,
          ({ progressTotal, total }) => {
            console.log(`Downloaded ${progressTotal} of ${total} bytes for new apk`), // a callback that will be called with the download progress
              progressSetter(progressTotal / total);
          }
        );
      } catch (error) {
        if (typeof error == 'string' && error.includes("404")) {
          console.log("Wrong app name format or release");
        } else {
          console.error("Unknown error: ", error);
        }
        return;
      }
    }

    if (!(await canInstall())) {
      await requestInstallPermission();
      if (!(await canInstall())) return; // user declined
    }

    await install(path);
  }
}


function checkVersionNumber(currentVersion: number[], newestVersion: number[]) {
  let getNew = false;
  for (let i = 0; i < Math.max(currentVersion.length, newestVersion.length); i++) {
    const curr = currentVersion[i] || 0;
    const newest = newestVersion[i] || 0;
    if (curr < newest) {
      getNew = true;
      break;
    } else if (curr > newest) {
      break;
    }
  }
  return getNew;
}

async function removeLeftoverUpdateApk() {
  let entries = await readDir('.', { baseDir: BaseDirectory.AppCache });
  let apks = entries.filter(entry => entry.isFile && entry.name.includes(".apk") && entry.name.includes("update"));

  for (let apk of apks) {
    remove(await join(await appCacheDir(), apk.name));
  }
}

