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
import { ElementFactory, Question, Serializer, SvgRegistry } from "survey-core";
import { SurveyQuestionElementBase, ReactQuestionFactory } from "survey-react-ui";
import { GenerateRandomString } from './utilities/commonfunctions';

const CUSTOM_TYPE = "ckeditor-rte";

SvgRegistry.registerIconFromSvg("icon-" + CUSTOM_TYPE, "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-1.3 -7.9 872.7 968.5\"><path d=\"m740.1 661.3 ... </svg>");

// Extend Window interface to declare ClassicEditor property
declare global {
    interface Window {
        ClassicEditor: any;
    }
}

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
    ControlRandomString: string;
    constructor(props: any) {
        super(props);
        this.ControlRandomString = GenerateRandomString(8);
    }

    get question(): QuestionCkEditorModel {
        return this.questionBase as QuestionCkEditorModel;
    }
    get value(): any {
        return this.question.value ?? "";
    }
    get controlId(): string {
        return "div_surveyform_" + this.ControlRandomString + this.question.name;
    }

    HandleValueChange = (val: any) => {
        this.question.value = val;
    };
    // Support the read-only and design modes
    get style() {
        return { height: this.question.height };
    }
    
    componentDidMount() {
        const div = document.querySelector("#" + this.controlId);

        if (window.ClassicEditor) {
            const isReadOnly = this.question.isReadOnly || this.question.isDesignMode;

            window.ClassicEditor.create(div, {
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
            }).then((editor: any) => {
                editor.setData(this.value);
                isReadOnly ? editor.enableReadOnlyMode(this.controlId) : editor.disableReadOnlyMode(this.controlId);
                editor.model.document.on('change', () => {
                    this.HandleValueChange(editor.getData());
                });
            })
            .catch((error: any) => {
              console.error(error);
            });
        }
    }

    renderElement() {
        return (<div id={ this.controlId } style={{ height: this.question.height }}></div>);
    }
}

// Register `SurveyQuestionCkEditor` as a class that renders `CkEditor` questions
export function RegisterCkEditorRteComponent() {
    ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props: any) => {
        return React.createElement(SurveyQuestionCkEditor, props);
    });
}