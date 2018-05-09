import { EventBus } from './eventBus'

class MyFileReader{
    constructor(cb) {
        this.cb = cb

        if (this.isAvailable) {
            console.log('File API is available.')
        } else { 
            console.log('File API is not available.')
            this.cb()
        }
    }

    isAvailable() { 
        return (window.File && window.FileReader && window.FileList && window.Blob)
    }

    handleFile(ev) { 
        let files = ev.target.files
        for (let i = 0; i < files.length; i++) {
            let f = files[i]
            if (!f.name.match(/json/)) {
                return
            }

            this.reader = new FileReader()

            this.reader.onload = function (evt) {
                debugger
                if (evt.target.readyState == FileReader.DONE) {
                    console.log(evt.target.result)
                    EventBus.$emit('file', evt.target.result)
                }
            };

            this.reader.onerror = function (evt) { 
                console.log(evt)
            }

            // this.reader.readAsArrayBuffer(f);
            this.reader.readAsBinaryString(f);

        }
    }
}

export { MyFileReader }

