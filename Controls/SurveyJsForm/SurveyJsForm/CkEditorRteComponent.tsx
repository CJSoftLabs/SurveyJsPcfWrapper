/*
MIT License

Copyright (c) 2024 CJSoftLabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as React from "react";
import { ElementFactory, Question, Serializer } from "survey-core";
import { SurveyQuestionElementBase, ReactQuestionFactory } from "survey-react-ui";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SvgRegistry } from "survey-core"

const CUSTOM_TYPE = "ckeditor-rte";

SvgRegistry.registerIconFromSvg("icon-" + CUSTOM_TYPE, "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-1.3 -7.9 872.7 968.5\"><path d=\"m740.1 661.3 130.3-2.3c-.5 18.3-5.8 36.1-15.2 51.7-3.7 6.5-7.5 12.8-11.2 19.2-7.4 12.9-14.7 25.8-22.2 38.6q-35.7 61.2-71.8 122.4c-5 8.5-10.8 16.5-16.3 24.7-8.2 11.8-18.8 21.6-31.2 28.7-12.1 6.9-25.7 10.8-39.6 11.5-28.9 2.4-57.9 3.1-86.8 2.2-50.6-.4-101.2 2.6-151.7.3-13.5-.3-26.8-2.7-39.5-7.3-4.3-1.7-8.4-3.8-12.3-6.3l-.9-.6 83.6-152.6s24.3-46.5 28.6-53.8c13.9-22.5 33.1-41.2 56.1-54.4 18.8-11.1 39.7-18.2 61.3-20.9 13-1.6 138.8-1.1 138.8-1.1zm-28.2 37.1q-.5.5-.8 1 .3-.5.8-1zm-1.4 3.1q.1-1.1.6-2.1-.5 1-.6 2.1z\" fill=\"#444540\"/><path d=\"m266.4 886.4c-63.6-37.5-129.7-70.8-191.9-110.8-16.9-10.2-32.1-23.1-44.9-38.2-19.9-24.7-25.2-54.2-26.8-84.6-4.1-75.1-.8-150.4-2.4-225.6-.8-35.8-.3-71.7.1-107.5.5-59.2 27.7-101.5 77.8-130.8q76.1-44.7 152.3-89.2 60.3-35.4 121-70.2c9.3-5.3 19.2-9.4 28.9-14 49.8-23.4 95.1-8.3 139.3 16.2 2.8 1.5 5.5 3.4 8.2 5.1 23.1 10 44 24 65.8 36.3q87.5 49.5 174.7 99.4c17.5 10.3 34.4 21.6 50.6 33.9 35.6 26.6 46.8 64.5 49.2 106.4 3.1 52.3 1.6 104.6 1.6 156.9 0 29.1.4 58.3.7 87.4l-72.3 1.3s-66.7-.3-125.8 0c.3-27.9-.2-55.7-.1-83.6.1-28.4 1-56.8-.5-85.2-1.3-22.8-7.3-43.3-26.7-57.7q-13.1-10-27.5-18.3-47.4-27-95.1-53.6-17.4-10.7-35.8-19.6c-1.4-.9-2.9-1.9-4.4-2.7-24.1-13.3-48.8-21.4-76-8.5-5.3 2.5-10.7 4.7-15.8 7.6q-33.1 19.1-66.1 38.4-41.6 24.4-83.3 48.7c-27.4 16-42.3 39.1-42.7 71.2-.2 19.5-.6 38.9-.2 58.4.7 40.8-1.3 81.7.8 122.5.8 16.5 3.6 32.5 14.5 45.9 6.9 8.2 15.1 15.2 24.3 20.7 33.9 21.6 69.9 39.5 104.5 59.8 12.1 7.1 24.3 14.3 36.7 21-9.7 18.5-18.4 35.1-18.4 35.1l-76 138.8q-9.2-5.5-18.3-10.9z\" fill=\"#645a75\"/></svg>");

// Create a question model
export class QuestionCkEditorModel extends Question {
    getType(): string {
        return CUSTOM_TYPE;
    }
    get height(): string {
        return this.getPropertyValue("height");
    }
    set height(val: string) {
        this.setPropertyValue("height", val);
    }
}

// Register the model in `ElementFactory`
export function RegisterCkEditorRteToolboxItem() {
    ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
        return new QuestionCkEditorModel(name);
    });
}

// Add question type metadata for further serialization into JSON
Serializer.addClass(
    CUSTOM_TYPE,
    [
        { name: "height", default: "200px", category: "general" }
    ],
    function () {
        return new QuestionCkEditorModel("");
    },
    "question"
);

// Create a class that renders CkEditor
export class SurveyQuestionCkEditor extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
    }
    get question(): QuestionCkEditorModel {
        return this.questionBase as QuestionCkEditorModel;
    }
    get value(): any {
        return this.question.value;
    }
    HandleValueChange = (val: any) => {
        this.question.value = val;
    };
    // Support the read-only and design modes
    get style() {
        return { height: this.question.height };
    }
    
    renderCkEditor() {
        const isReadOnly = this.question.isReadOnly || this.question.isDesignMode;
        const config = {
            toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'bulletedList',
                'numberedList',
                '|',
                'insertTable',
                '|',
                'undo',
                'redo'
            ]
            },
            image: {
            toolbar: [
                'imageStyle:full',
                'imageStyle:side',
                '|',
                'imageTextAlternative'
            ]
            },
            table: {
                contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
            },
            language: 'en'
        };

        return (
            <CKEditor
                editor={ ClassicEditor }
                data={this.value}
                config={ config }
                disabled={ isReadOnly }
                onBlur={ ( event, editor ) => {
                    this.HandleValueChange(editor.getData());
                    console.log(this.value);
                } }
            />
        );
    }

    renderElement() {
        return this.renderCkEditor();
    }
}

// Register `SurveyQuestionCkEditor` as a class that renders `CkEditor` questions
export function RegisterCkEditorRteComponent() {
	ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props: any) => {
        console.log(props);
		return React.createElement(SurveyQuestionCkEditor, props);
	});
}