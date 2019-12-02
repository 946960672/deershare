
const CHUNK_SIZE = 16 * 1024;

class FileChunker {
  constructor(file) {
    this.file = file;
    this.reader = new FileReader();
    this.offset = 0;
  }

  getNextChunk() {
    return new Promise((resolve, reject) => {
      if (this.offset >= this.file.size) {
        resolve({
          done: true,
        })
      }

      this.reader.onload = (e) => {
        this.offset += CHUNK_SIZE
        resolve({
          done: this.offset >= this.file.size,
          chunk: e.target.result
        })
      }
      this.reader.onabort = () => {
        reject('abort')
      }
      this.reader.onerror = (evt) => {
        reject('error' + evt)
      }
      const blob = this.file.slice(this.offset, this.offset + CHUNK_SIZE)
      this.reader.readAsArrayBuffer(blob)
    })
  }
}

export default FileChunker