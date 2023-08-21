import React, { useCallback, useEffect, useState} from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css"
import {io} from "socket.io-client";

const TOOLBAR_OPTIONS = [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{font: []}],
    [{list : "ordered"} , { list: "bullet"}],
    ["bold", "italic", "underline"],
    [{color: []} , {background: [] }],
    [{script: "sub"}, { script: "super" }],
    [{align: [] }],
    ["image", "blockqoute", "code-block"],
    ["clean"],
]

const TextEditor = () => {
    const[socket, setSocket] = useState();
    const[quill, setQuill] = useState();

    //creating and disconnecting sockets
    useEffect(() => {
        const s = io("http://localhost:3001")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        //check if have a socket or quill
        if (socket == null || quill == null) return

        const handler = (delta) => {
            //updates the changes passed from the client
            quill.updateContents(delta)
        }
        socket.on('receive-changes', handler)
        
        return () => {
            socket.off('receive-changes', handler)
        }
    }, [socket, quill])

    //for detecting changes
    useEffect(() => {
        //check if have a socket or quill
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            //to emit a msg from client to server
            socket.emit("send-changes", delta)
        }

        quill.on('text-change', handler)
        
        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback( wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div");
        wrapper.append(editor)
        const q = new Quill(editor, {theme : "snow", modules: { toolbar: TOOLBAR_OPTIONS}})
        setQuill(q);

    }, []);

  return (
    <div className="container" ref={wrapperRef}></div>
  );
}

export default TextEditor;
