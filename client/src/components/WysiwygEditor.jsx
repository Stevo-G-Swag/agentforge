import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function WysiwygEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = new Quill(editorRef.current, {
      theme: 'snow'
    });

    editor.on('text-change', function(delta, oldDelta, source) {
      if (source === 'user') {
        console.log('User has made changes to the text editor.');
      }
    });

    return () => {
      editor.off('text-change');
      console.log('Cleanup editor on component unmount');
    };
  }, []);

  return <div ref={editorRef} />;
}

export default WysiwygEditor;