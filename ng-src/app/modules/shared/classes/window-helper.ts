export class WindowHelper {
  static toggleMaximize(): void {
    (window as any).electron.ipcRenderer.invoke('toggle-maximize');
  }
}
