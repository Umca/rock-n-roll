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
            this.binary = ''

            this.reader.onload = function (evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    EventBus.$emit('file', evt.target.result)
                    // console.log(evt.target.result)
                    // var bytes = new Uint8Array(evt.target.result);
                    // var length = bytes.byteLength;
                    // for (var i = 0; i < length; i++) {
                    //     this.binary += String.fromCharCode(bytes[i]);
                    // }
                    // console.log(this.binary.indexOf('{'))
                    // let a = '"' + this.binary.slice(this.binary.indexOf('{')) + '"'.replace(/ /g, '')
                    // console.log(a)
                }
            };
            

            this.reader.onerror = function (evt) { 
                console.log(evt)
            }

            // this.reader.readAsArrayBuffer(f);
            this.reader.readAsText(f);

        }
    }
}

export { MyFileReader }

