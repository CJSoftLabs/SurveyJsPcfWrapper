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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SvgRegistry } from "survey-core"

const CUSTOM_TYPE = "quill-rte";

SvgRegistry.registerIconFromSvg("icon-" + CUSTOM_TYPE, "<svg viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#000000\" d=\"M496.938 14.063c-95.14 3.496-172.297 24.08-231.282 55.812l-29.47 49.28-4.967-28.093c-10.535 7.402-20.314 15.222-29.314 23.407l-14.687 45.06-5.032-25.155c-40.65 45.507-60.41 99.864-58.938 155.906 47.273-93.667 132.404-172.727 211.97-221.155l9.717 15.97c-75.312 45.838-156.387 121.202-202.187 208.25h12.156c19.78-12.02 39.16-26.858 58.406-43.44l-30.28 1.595 54.218-23.094c46.875-43.637 93.465-94.974 143.313-138.28l-24.47-5.19 56.5-21.03c26.853-20.485 54.8-37.844 84.344-49.843zM59.53 312.03v30.408H194V312.03H59.53zm20.376 49.095L47.25 389.813 24.97 474.78l14.53 15.876h177.22l14.56-15.875L209 389.814l-30.906-28.688H79.906z\"/></svg>");

// Create a question model
export class QuestionQuillModel extends Question {
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
export function RegisterQuillRteToolboxItem() {
    ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
        return new QuestionQuillModel(name);
    });
}

// Add question type metadata for further serialization into JSON
Serializer.addClass(
    CUSTOM_TYPE,
    [
        { name: "height", default: "200px", category: "general" },
    ],
    function () {
        return new QuestionQuillModel("");
    },
    "question"
);

// Create a class that renders Quill
export class SurveyQuestionQuill extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
    }
    get question(): QuestionQuillModel {
        return this.questionBase as QuestionQuillModel;
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
    
    renderQuill() {
        const isReadOnly = this.question.isReadOnly || this.question.isDesignMode;
         
        return (
            <ReactQuill
                style={this.style}
                readOnly={isReadOnly}
                value={this.value}
                onBlur={(range, source, quill) => {
                    this.HandleValueChange(quill.getHTML());
                }}
            />
        );
    }

    renderElement() {
        return this.renderQuill();
    }
}

// Register `SurveyQuestionQuill` as a class that renders `quill` questions
export function RegisterQuillRteComponent() {
	ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props: any) => {
		return React.createElement(SurveyQuestionQuill, props);
	});
}