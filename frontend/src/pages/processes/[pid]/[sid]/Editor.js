
import 'quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-with-table/dist/quill.snow.css';


const Editor = ({ Id, handleChangeMessage, message }) => {
    // const ReactDraftWysiwyg = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
    const ReactDraftWysiwyg = useMemo(() => dynamic(() => import('react-quill-with-table'), { ssr: false }), []);

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'background',
        'color',
        'formula ',
        'video',
    ];

    const modules = {

        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote','background','color','image'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],

        ],

        clipboard: {
            matchVisual: false,
        },
    };

    const editorChangeVal = (val) => {
        if (Id) {
            handleChangeMessage({ id: Id, data: val })
        } else {
            handleChangeMessage(val)
        }
    }
   
    

    return (
        <div>

            <ReactDraftWysiwyg
                modules={modules}
                formats={formats}
                theme="snow"
                onChange={editorChangeVal}
                value={message}
                
            />

        </div>
    );
};

export default Editor;