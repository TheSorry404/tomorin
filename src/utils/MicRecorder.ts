/**
 * 麦克风录音器类，支持在停止录音时直接获取最终 Blob
 */
class MicRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  public recordingFile: Blob | null = null;
  public isRecording: boolean = false;
  private startTime: number | null = null;

  /**
   * 开始录音
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) return;

    try {
      // 获取麦克风权限并创建 MediaRecorder
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      // 收集音频数据
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // 开始录制
      this.mediaRecorder.start();
      this.startTime = Date.now();
      this.isRecording = true;
      console.log('开始录音');
    } catch (error) {
      console.error('无法访问麦克风:', error);
      throw error;
    }
  }

  /**
   * 停止录音，并返回一个 Promise，在音频 Blob 构建完成时 resolve
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.isRecording || !this.mediaRecorder) {
        reject(new Error('当前未在录音'));
        return;
      }

      // 重写 onstop 回调，等数据收集完毕后生成 Blob 并 resolve
      this.mediaRecorder.onstop = () => {
        this.recordingFile = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('录音已保存:', this.recordingFile);

        // 清理音频流
        this.stream?.getTracks().forEach((track) => track.stop());
        this.stream = null;
        this.audioChunks = [];
        this.isRecording = false;

        if (this.recordingFile) {
          resolve(this.recordingFile);
        } else {
          reject(new Error('生成 Blob 失败'));
        }
      };

      // 触发停止录制
      this.mediaRecorder.stop();
      console.log('停止录音');
    });
  }

  /**
   * 获取录音时长（单位：秒）
   */
  getAudioTime(): number {
    if (this.startTime !== null) {
      return (Date.now() - this.startTime) / 1000;
    } else {
      return 0;
    }
  }
}

export default MicRecorder;
